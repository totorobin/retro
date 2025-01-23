# Retro

Webapp with a whiteboard shared for multiple users

## Installation

### Prerequisites

Install pnpm

```sh
npm install -g pnpm
```

### Setup

```sh
# cd retro/
pnpm install
```

## Run locally

```sh
# cd retro/
pnpm dev
```

Check the url given in the frontend's logs to use app with your browser


# utilisation dans un docker


```sh
# cd retro/
docker build -t retro .
docker run -p 8080:8080 -d retro
```