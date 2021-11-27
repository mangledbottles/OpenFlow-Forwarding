# OpenFlow UDP Socket Protocol
![OpenFlow Network](Assets/Network.png)

This project is an implementation of the [OpenFlow Protocol](https://en.wikipedia.org/wiki/OpenFlow) using the [Node.js UDP Datagram Socket Library](https://nodejs.org/api/dgram.html). The core functionality of this system provides a front-end user interface for the client which connects to the OpenFlow Network.

The OpenFlow network consists of a number of **routers** that **forward message**s and are controlled by a centralised switcher.

The switcher is a simple device that allows the routers to communicate with each other. It also allows the routers to communicate with the network.

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

## Communication Protocol
Communication between the Switcher, multiple Routers and multiple Clients is handled by a universal Protocol Type system.

| Protocol Type | Description | Components [Origin, Destination] |
| ------------- | ----------- | ---------- |
| #0 | Switcher accepted this current Router on network | Switcher -> Router |
| #1             | New Router Detected on Network by Switcher | Router -> Switcher |
| #2 | Router querying Switcher for information about Clients from Forwarding Table | Router -> Switcher |
| #3 | Client connecting to Router to get information about Forwarding Table | Client -> Router |
| #4 | Router received information about a Client from Switcher via Flowtable | Switcher -> Router |
| #5 | Router received message instructions from Client to send message over the network | Client -> Router |
| #6 | Router received updated information about current Router | Switcher -> Router |


## References
- [0] OpenFlow - https://en.wikipedia.org/wiki/OpenFlow
- [1] Node Datagram Library - https://nodejs.org/api/dgram.html