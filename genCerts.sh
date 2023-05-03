#!/bin/bash          
CN="koron.guillaume.network" #insert domain name here
openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out ./docker/config/nginx/localhost.crt -keyout ./docker/config/nginx/localhost.key -subj "/C=CH/ST=Lausanne/L=Lausanne/O=42/OU=gaubert/CN=$CN"
