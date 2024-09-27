FROM node:20-bookworm-slim AS web-builder
WORKDIR /build
COPY web/package*.json ./
RUN npm ci
COPY web .
RUN npm run build

FROM golang:1.22-bookworm AS bin-builder
WORKDIR /build
COPY . .
RUN go build .

FROM python:3.12-slim-bookworm
RUN apt update && apt install -y python3-fonttools && rm -rf /var/lib/apt/lists/*
COPY font.py /font.py
COPY --from=web-builder /build/dist /web/dist
COPY --from=bin-builder /build/flip /usr/bin/flip
CMD ["flip"]
