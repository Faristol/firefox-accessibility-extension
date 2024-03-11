FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y python3-pip git git-all && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install Flask flask-cors transformers torch
RUN git lfs install
RUN git clone https://huggingface.co/facebook/bart-large-cnn
EXPOSE 5000

WORKDIR /sumup
COPY . .

CMD ["python3", "sumup.py"]