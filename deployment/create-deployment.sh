#!/bin/bash

# Check that all necessary files exist
if [ ! -f "./create-secret.sh" ]; then
	echo "This script must be ran in the same directory as create-secret.sh"
	exit 1
fi

if [ ! -f "./shit-chan.yaml" ]; then
	echo "This script must be ran in the same directory as shit-chan.yaml"
	exit 1
fi

if [ ! -f "../assets/token" ]; then
    echo "The token file was not in ../assets/token as expected"
    exit 1
fi

# Ensure the script is ran as root so that kubectl commands can be applied
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

# Check that kubectl is installed
if [ `type -t kubectl`"" == "" ]; then
	echo "kubectl does not exist in this environment, ensure the k8s cluster is setup"
	exit 1
fi

token=`cat ../assets/token`

# All pre-req checks are finished, can now begin running real commands
echo "Creating secrets"
if ! sudo ./create-secret.sh $token; then
	echo "Creating the secrets failed, bailing early. Please fix k8s environment before running this script again"
	exit 1
fi

echo "Creating deployment"
if ! sudo kubectl apply -f ./shit-chan.yaml; then
	echo "Creating the deployment failed, bailing early. Please fix the k8s environment before running this script again"
	exit 1
fi

echo "Discord bot successfully deployed to cluseter, pinging it to confirm"
