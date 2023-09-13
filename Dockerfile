FROM node:bookworm AS web-builder
WORKDIR /build
COPY web/package*.json ./
RUN npm ci
COPY web .
RUN npm run build

FROM golang:bookworm AS bin-builder
WORKDIR /build
COPY . .
RUN go build .

FROM debian:bookworm
RUN apt update && apt install -y python3 python3-fonttools
COPY font.py /font.py
COPY --from=web-builder /build/dist /web/dist
COPY --from=bin-builder /build/flip /usr/bin/flip
CMD ["flip"]
