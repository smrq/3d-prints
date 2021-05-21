FROM node:latest

RUN apt-get -y update \
  && apt-get install -y openscad \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /root/.local/share/OpenSCAD/libraries
RUN wget https://github.com/Irev-Dev/Round-Anything/archive/refs/tags/1.0.3.zip && \
	unzip 1.0.3.zip */*.scad && \
	rm 1.0.3.zip

WORKDIR /root/workspace
