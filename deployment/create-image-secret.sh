#!/bin/bash
if [ "$1" == "" ]; then
    echo no username provided
    exit 1
fi  
if [ "$2" == "" ]; then
    echo no password provided
    exit 1
fi  
kubectl create secret docker-registry regcred --docker-server=docker.io --docker-username=$1 --docker-password=$2 --docker-email=$1