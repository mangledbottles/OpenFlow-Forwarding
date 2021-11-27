# Switcher and Router
This folder is the source code for the Switcher and Routers.

## Installation
```
npm install

# Start the Switcher
npm run switcher

# Start a Router (can start as many as you want)
npm run router
```
## Dockerising the Switcher
![Dockerfile](../Assets/Dockerfile.png)

```
# Build the Docker image
docker build -t dermot/openflow:1.0 .

# Run the Docker image inside a container
docker run -it --rm --name openflow -p 51510:51510 dermot/openflow:1.0
```

## Switcher
The Switcher is a NodeJS application that listens on port 51510 for OpenFlow messages.

## Router
The Router is a NodeJS application that can be started as many different processes to create multiple OpenFlow layers that connect together.
