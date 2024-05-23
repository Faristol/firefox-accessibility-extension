from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from dotenv import dotenv_values
from transformers import BartForConditionalGeneration, BartTokenizer

config = dotenv_values(".env")
app = Flask(__name__)
CORS(app, origins="*")
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")

API_KEY = config.get("API_KEY")


@app.route("/sumup", methods=["POST"])
def summarize_text():
    api_key_header = request.headers.get("x-api-key")
    if api_key_header != API_KEY:
        abort(403, description="Forbidden: Invalid API Key")
    data = request.get_json()
    text_to_summarize = data["text"]
    chunk_size = 1024
    chunks = [
        text_to_summarize[i : i + chunk_size]
        for i in range(0, len(text_to_summarize), chunk_size)
    ]
    summaries = []

    for chunk in chunks:
        inputs = tokenizer(chunk, return_tensors="pt", max_length=1024, truncation=True)

        outputs = model.generate(
            inputs["input_ids"],
            max_length=300,
            min_length=100,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True,
        )

        summary = " ".join(
            tokenizer.decode(
                g, skip_special_tokens=True, clean_up_tokenization_spaces=False
            )
            for g in outputs
        )

        summaries.append(summary)
    full_summary = " ".join(summaries)
    print(full_summary)
    return jsonify({"summary": full_summary})


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0")
