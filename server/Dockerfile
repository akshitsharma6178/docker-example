FROM python:3.8

WORKDIR /app

RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y libgl1 && \
    apt-get install -y \
    build-essential

COPY package.json . 

COPY requirements.txt . 

RUN npm install && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]
