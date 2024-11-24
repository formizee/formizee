FROM  node:lts AS compile

WORKDIR /app
RUN npm install -g workerd@latest pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .
RUN rm .dev.vars || true


RUN pnpm install --offline -r

WORKDIR /app/apps/vault
RUN pnpm wrangler deploy --outdir=dist --dry-run

RUN pnpm workerd compile ./worker.capnp > formizee-vault


FROM ubuntu:latest
COPY --from=compile /app/apps/vault/formizee-vault /usr/bin/formizee-vault

EXPOSE 9000
CMD ["formizee-vault"]
