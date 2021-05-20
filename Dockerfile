FROM node:latest

RUN apt-get -y update \
  && apt-get install -y openscad \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /root/workspace
COPY package.json .yarnrc.yml yarn.lock .
COPY .yarn/releases .yarn/releases
RUN yarn
