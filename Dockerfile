FROM python:3.8.5-alpine3.12

RUN mkdir /app
WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "server.py"]

EXPOSE 5000