FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y python3-pip git git-lfs python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --upgrade pip
RUN pip install Flask flask-cors transformers torch python-dotenv

RUN git lfs install
RUN git clone https://huggingface.co/facebook/bart-large-cnn /bart-large-cnn
EXPOSE 5000

COPY . .

CMD ["python3","sumup_vm.py"]
