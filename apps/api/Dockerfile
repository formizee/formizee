FROM  node:lts AS compile

WORKDIR /app
RUN npm install -g workerd@latest pnpm

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .
RUN rm .dev.vars || true


RUN pnpm install --offline -r

WORKDIR /app/apps/api
RUN pnpm wrangler deploy --outdir=dist --dry-run

RUN pnpm workerd compile ./worker.capnp > formizee


FROM ubuntu:latest
COPY --from=compile /app/apps/api/formizee /usr/bin/formizee

EXPOSE 8787
CMD ["formizee"]
