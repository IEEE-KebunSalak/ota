FROM oven/bun:latest AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

USER bun
EXPOSE 3001
# CMD ["bun", "start"]

# bunx prisma generate && bun start
CMD ["bunx", "prisma", "generate", "&&", "bun", "start"]