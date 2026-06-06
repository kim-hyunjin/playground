# syntax=docker/dockerfile:1

FROM rust:1-bookworm AS builder

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends pkg-config libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock askama.toml ./
COPY src ./src
COPY templates ./templates

RUN cargo build --release --bin board-api

FROM debian:bookworm-slim AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates libsqlite3-0 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN useradd --system --no-create-home --shell /usr/sbin/nologin appuser \
    && mkdir -p /data \
    && chown appuser:appuser /data

COPY --from=builder /app/target/release/board-api /usr/local/bin/board-api

USER appuser

ENV HOST=0.0.0.0 \
    PORT=3000 \
    DATABASE_URL=sqlite:///data/board.db?mode=rwc

EXPOSE 3000

VOLUME ["/data"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -fsS http://127.0.0.1:3000/health || exit 1

CMD ["board-api"]
