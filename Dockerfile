FROM clojure:lein

RUN apt-get -y update \
  && apt-get install -y openscad \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /root/workspace
COPY project.clj .
RUN lein deps
