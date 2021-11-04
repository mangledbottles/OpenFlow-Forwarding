
/** Import dependecies */
import dgram from "dgram";

/** Initialise UDP Socket */
const socketPort: number = 51510;
const Server = dgram.createSocket('udp4');
/** Launch UDP Socket and HTTP Servers, and listen on given port */
try {
    Server.on('listening', (): void => {
      const address = Server.address();
      console.log(`Server listening ${address.address}:${address.port}`);
    });
  
    Server.bind(socketPort, (): void => {
      console.log(`UDP Datagram Server is active at http://localhost:${socketPort}`);
    });
  
  } catch (error: any) {
    console.error(`An error occurred with starting Server ${error.toString()}`);
  }