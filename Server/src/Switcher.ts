
/** Import dependecies */
import dgram from "dgram";

/** Initialise UDP Socket */
const socketPort: number = 51510;
const Switcher = dgram.createSocket('udp4');

/** Handle errors and close Socket */
Switcher.on('error', (err) => {
    console.log(`Server error:\n${err.stack}`);
    Switcher.close();
});

/** Receive Messages from Client */
let messagesCount = 0;
Switcher.on('message', (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  /** Add Client to Client List for Broadcasting */
  const { address, port } = rinfo;
  Routers.add(newClient({ address, port }));

  /** Repeat message back to Client */
  let message = Buffer.from(JSON.stringify({ type: 'switcher', message: `Hello ${rinfo.port}, you are #${++messagesCount}, time is ${new Date()}` }));
  Switcher.send(message, port, address, function (error) {
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
  port: number
}
interface Router extends Client {
  in?: Router | Client;
  out?: Router | Client;
}

let Routers: Set<string> = new Set();

function newClient({ address, port }: Router) {
  return JSON.stringify({ address, port });
}

function broadcast(broadcastMessage: string) {
  console.log("Broadcasting message to all Clients")

  var message = Buffer.from(JSON.stringify({ type: 'Switcher', message: broadcastMessage }));
  const ClientList = Array.from(Routers);
  if (ClientList.length == 0) console.log("No active Clients");

  for (let clientNumber in ClientList) {
    const { address, port } = JSON.parse(ClientList[clientNumber]);

    Switcher.send(message, 0, message.length, port, address, (error) => {
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
    Switcher.on('listening', (): void => {
      const address = Switcher.address();
      console.log(`Switcher Server listening ${address.address}:${address.port}`);
    });
  
    Switcher.bind(socketPort, (): void => {
      setInterval(() => {
        broadcast('Swticher is active')
        console.log(Routers)
      }, 5000)
      console.log(`Switcher UDP Datagram Server is active at http://localhost:${socketPort}`);
    });
  
  } catch (error: any) {
    console.error(`An error occurred with starting Server ${error.toString()}`);
  }