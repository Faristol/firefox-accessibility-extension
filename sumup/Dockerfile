FROM ubuntu:latest

RUN apt update && \
    apt install -y python3-pip && \
    rm -rf /var/lib/apt/lists/*

RUN pip3 install Flask transformers torch

WORKDIR /sumup
COPY . .

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]