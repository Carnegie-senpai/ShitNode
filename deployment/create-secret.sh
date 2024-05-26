#!/bin/bash
if sudo kubectl get secrets | grep discord-token; then
    echo test
    exit 0
fi

if [ "$1" == "" ]; then
    echo no token provided
    exit 1
fi  
sudo kubectl create secret generic discord-token --from-literal=token=$1