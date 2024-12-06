FROM  node:lts AS compile

WORKDIR /app
RUN npm install -g workerd@latest pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .
RUN rm .dev.vars || true


RUN pnpm install --offline -r

WORKDIR /app/apps/vault
RUN pnpm build
RUN pnpm wrangler deploy --minify --outdir=dist --dry-run

RUN pnpm workerd compile ./worker.capnp > vault


FROM ubuntu:latest
COPY --from=compile /app/apps/vault/vault /usr/bin/vault

EXPOSE 8888
CMD ["vault"]
