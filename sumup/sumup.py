from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

from transformers import BartForConditionalGeneration, BartTokenizer

app = Flask(__name__)
CORS(app, origins="*")

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
# Inicializar el modelo BART y el tokenizador
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")


@app.route('/sumup', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text_to_summarize = data['text']
    tokens = tokenizer.tokenize(text_to_summarize)
    chunk_size = 1024
    print(len(tokens))
    chunks = [tokens[i:i + chunk_size] for i in range(0, len(tokens), chunk_size)]
    print(chunks)
    summaries = []
    for chunk_tokens in chunks:
        # Convertir los tokens de este trozo de nuevo a texto
 
        chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=False)
   
        
        # Generar la sumarización para este trozo de texto
        input_ids = tokenizer.encode(chunk_text, return_tensors='pt', max_length=1024, truncation=True)
        print(input_ids)
        summary_ids = model.generate(input_ids, max_length=150, min_length=30, do_sample=False)
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        summaries.append(summary)
    
    final_summary = ' '.join(summaries)

    return jsonify({'summary': final_summary})


if __name__ == '__main__':
    app.run(debug=True)
