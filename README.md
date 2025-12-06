# ShitNode
Shit-chan is a bot that provides a few functionality, mostly comedic. It is built as a docker image and deployed via k3s (or k8s if you are a big boy)

## Local dev setup
### Prequisites:
- Node v25
- pnpm

1. Install all dependencies
```bash
pnpm install --frozen-lockfile
```
2. Build typescript -> javascript 
```bash
pnpm run build
```
3. Create token file
```bash
mkdir assets && touch assets/token
```
4. Use valid bot-token from [discord](https://discord.com/developers/applications) and paste it into the token file

## Running a docker build
### Prerequisites:
 - Must have podman or dockerdesktop or other equivalent docker implementation
 - token file w/ valid token in assets directory
Run the following command to produce an image:
```bash
podman build -t docker.io/USERNAME_HERE/shit-chan:X.X.X -f ./shit-chan.dockerfile
```
## Troubleshooting
If build is failing though it seems it shouldn't you can try building w/o a cache by adding the `--no-cache` flag to ensure that it is a fresh build and a stale cash of one of the layers is not causing an issue

If the bot is failing to start ensure the token is created and valid

## Deploying the setup to k8s
1. Create token file
```bash
mkdir assets && touch assets/token
```
2. Use valid bot-token from [discord](https://discord.com/developers/applications) and paste it into the token file
3. If it is your first time setting up the environment setup k8s to be able to pull from docker w/ this script
```bash
cd deployment && ./create-image-secret.sh
```
4. Run the setup script k8s
```bash
cd deployment && ./create-deployment.sh
```