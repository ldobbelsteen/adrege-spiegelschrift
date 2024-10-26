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
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r ./requirements.txt
COPY font.py /font.py
COPY --from=web-builder /build/dist /web/dist
COPY --from=bin-builder /build/flip /usr/bin/flip
EXPOSE 1235
CMD ["flip"]
