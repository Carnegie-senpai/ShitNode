#!/bin/bash
read -p 'Username: ' uservar
read -sp 'Password: ' passvar
if [ "$uservar" == "" ]; then
    echo no username provided
    exit 1
fi  
if [ "$passvar" == "" ]; then
    echo no password provided
    exit 1
fi  
kubectl create secret docker-registry regcred --docker-server=docker.io --docker-username=$uservar --docker-password=$passvar --docker-email=$uservar