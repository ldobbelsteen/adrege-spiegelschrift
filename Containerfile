FROM node:22-bookworm-slim AS web-builder
WORKDIR /build
COPY web/package*.json ./
RUN npm ci
COPY web .
RUN npm run build

FROM golang:1.23-bookworm AS bin-builder
WORKDIR /build
COPY . .
RUN go build .

FROM python:3.13-slim-bookworm
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip &&
    pip install --no-cache-dir -r ./requirements.txt
COPY font.py /font.py
COPY --from=web-builder /build/dist /web/dist
COPY --from=bin-builder /build/adrege-spiegelschrift /usr/bin/adrege-spiegelschrift
EXPOSE 1235
CMD ["adrege-spiegelschrift"]
