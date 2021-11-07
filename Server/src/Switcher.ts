
/** Import dependecies */
import dgram from "dgram";

/** Initialise UDP Socket */
const socketPort: number = 51510;
const Server = dgram.createSocket('udp4');

/** Handle errors and close Socket */
Server.on('error', (err) => {
    console.log(`Server error:\n${err.stack}`);
    Server.close();
});

/** Receive Messages from Client */
let messagesCount = 0;
Server.on('message', (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  /** Add Client to Client List for Broadcasting */
  const { address, port } = rinfo;
  Clients.add(newClient({ address, port }));

  /** Repeat message back to Client */
  let message = Buffer.from(JSON.stringify({ type: 'switcher', message: `Hello ${rinfo.port}, you are #${++messagesCount}, time is ${new Date()}` }));
  Server.send(message, port, address, function (error) {
    if (error) {
      console.log(`Error sending data to Client #${rinfo.port}`)
    } else {
      console.log(`Data sent to Client #${rinfo.port}`);
    }
  });
});

/** Broadcast Information from Server to all Clients */
interface Client {
  address: string;
  port: number;
}

let Clients: Set<string> = new Set();

function newClient({ address, port }: Client) {
  return JSON.stringify({ address, port });
}

function broadcast(broadcastMessage: string) {
  console.log("Broadcasting message to all Clients")

  var message = Buffer.from(JSON.stringify({ type: 'Switcher', message: broadcastMessage }));
  const ClientList = Array.from(Clients);
  if (ClientList.length == 0) console.log("No active Clients");

  for (let clientNumber in ClientList) {
    const { address, port } = JSON.parse(ClientList[clientNumber]);

    Server.send(message, 0, message.length, port, address, (error) => {
      if (error) {
        console.log(`Broadcast Error sending data to Client #${port}`)
      } else {
        console.log(`Broadcast Data sent to Client #${port}`);
      }
    });

  }
}

/** Launch UDP Socket and HTTP Servers, and listen on given port */
try {
    Server.on('listening', (): void => {
      const address = Server.address();
      console.log(`Switcher Server listening ${address.address}:${address.port}`);
    });
  
    Server.bind(socketPort, (): void => {
      setInterval(() => {
        broadcast('Swticher is active')
        console.log(Clients)
      }, 5000)
      console.log(`Switcher UDP Datagram Server is active at http://localhost:${socketPort}`);
    });
  
  } catch (error: any) {
    console.error(`An error occurred with starting Server ${error.toString()}`);
  }