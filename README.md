# OpenFlow UDP Socket Protocol
![OpenFlow Network](Assets/Network.png)

This project is an implementation of the [OpenFlow Protocol](https://en.wikipedia.org/wiki/OpenFlow) using the [Node.js UDP Datagram Socket Library](https://nodejs.org/api/dgram.html). The core functionality of this system provides a front-end user interface for the client which connects to the OpenFlow Network.

The OpenFlow network consists of a number of **routers** that **forward message**s and are controlled by a centralised switcher.

## Project Structure
This project is divided into the following sections:
- [/Server](/Server)
  - Writen in NodeJS using the [dgram](https://nodejs.org/api/dgram.html) module to create a Switcher and a number of Routers.
- [/Client](/Client)
  - An [ElectronJS](https://www.electronjs.org/) desktop GUI application which provides a user interface that connects to the OpenFlow Network (in /Server).
  
## Downloading Repository
```
git clone https://github.com/mangledbottles/OpenFlow-Forwarding.git

cd OpenFlow-Forwarding

# See documentation inside /Client for installation of ElectronJS application
# See documentation inside /Server for installation of NodeJS Switcher and Routers
```



## References
- [0] OpenFlow - https://en.wikipedia.org/wiki/OpenFlow
- [1] Node Datagram Library - https://nodejs.org/api/dgram.html