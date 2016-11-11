#! /bin/bash
sudo apt-get update && \
  sudo apt-get install -y build-essential libssl-dev nginx daemontools devscripts && \
  # setting nginx
  sudo cp nginx/default /etc/nginx/sites-available/default && \
  sudo service nginx restart && \
  # setting node js
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash && \
  export NVM_DIR="$HOME/.nvm" && \
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
  nvm install v6.9.1 && \
  nvm alias default 6.9.1 && \
  npm install

rc=$?
if [[ $rc != 0 ]]; then
  exit $rc;
fi
nohup npm start
