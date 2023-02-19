# turbomeet

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [NPM](https://www.npmjs.com/get-npm)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file

```bash
cp .env.example .env
# Then edit the empty variables else the application will not work
```

3. Start the database

```bash
docker-compose up -d
```

4. Start the application

```bash
# production
npm build
npm start

# or development
npm run dev
```

5. Open the application in your browser

```bash
http://localhost:3000
```
