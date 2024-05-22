from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BartForConditionalGeneration, BartTokenizer


app = Flask(__name__)
CORS(app, origins="*")
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")


@app.route("/sumup", methods=["POST"])
def summarize_text():
    data = request.get_json()
    text_to_summarize = data["text"]
    chunk_size = 1024
    chunks = [
        text_to_summarize[i : i + chunk_size]
        for i in range(0, len(text_to_summarize), chunk_size)
    ]
    print(chunks)

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
    return jsonify({"summary": full_summary})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
