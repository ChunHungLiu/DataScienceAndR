#! /bin/bash
sudo apt-get update && \
  sudo apt-get install -y build-essential libssl-dev nginx daemontools devscripts && \
  # setting nginx
  sudo cp nginx/default /etc/nginx/sites-available/default && \
  sudo service nginx restart && \
  # setting node js
  curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | sh && \
  nvm install v6.9.1 && \
  nvm default v6.9.1 && \
  npm install

rc=$?
if [[ $rc != 0 ]]; then
  exit $rc;
fi
