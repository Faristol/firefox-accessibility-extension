from flask import Flask, request, jsonify
from transformers import pipeline


summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
app = Flask(__name__)

@app.route('/sumup', methods=['POST'])
def sumup():
    data = request.get_json()
    text_to_summarize = data['text']
    summary = summarizer(text_to_summarize, max_length=130, min_length=30, do_sample=False)
    return jsonify({'summary': summary[0]['summary_text']})
if __name__ == '__main__':
    app.run(debug=True)