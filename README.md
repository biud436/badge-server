# Introduction
This library allows you to show the status of certain website, as badge like as 'online' or 'offline'

# Usage
You need to install PM2 in the linux system such as ```ubuntu 20.04```

```sh
npm install -g pm2
```

and then next, you change directory as home directory as follows. after that, you must clone this repository.

```sh
cd ~/ubuntu/home
git clone https://github.com/biud436/badge-server.git
cd b*
npm install
```

and then try this.

```sh
pm2 start src/index.js
```

This webserver is used a port as 9003, so you have to open port 9003 by using ```iptables``` command, as follows.

```sh
iptables -I INPUT 1 -p tcp --dport 9003 -j ACCEPT
```

# Reference Docs
I've referred <a href="https://medium.com/p/f222ece09c23">this link</a>