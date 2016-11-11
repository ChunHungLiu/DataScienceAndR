#! /bin/bash
sudo apt-get update && \
 sudo apt-get install -y build-essential libssl-dev && \
 curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | sh && \
 nvm install v6.9.1 && \
 nvm default v6.9.1 && \
 npm install
