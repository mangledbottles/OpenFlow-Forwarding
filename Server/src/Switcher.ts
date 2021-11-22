
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

/**
 * Format of Flow Table - Hardcoded Data
 * 
 * Parameter 1: Router
 * Parameter 2: [ In, Out, address, port, forwardAddress, forwardPort ]
 *  */
let FlowTable = new Map<String, String[]>([
  ["R1", ["E1", "R2", "", "", "", ""]],
  ["R2", ["R1", "R3", "", "", "", ""]],
  ["R3", ["R2", "E2", "", "", "", ""]],
]);


/** Receive Messages from Routers */
let routerCount: number = 0, clientCount: number = 0;

Switcher.on('message', (msg, rinfo) => {
  console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  const { address, port } = rinfo;
  let { type, message: receivedMessage } = JSON.parse(msg.toString());

  let sendMessage: any;
  let messageType: number = -1;
  let routerId: string;

  switch (type) {

    case 1:
      // Type 1: New Router broadcasting existence
      console.log("New Router detected");

      // Assign ID to Router and add to Router List
      routerId = `R${++routerCount}`;
      Routers.add(newClient({ address, port, routerId }));
      sendMessage = { routerId, message: "New Router", address, port };
      messageType = 0;
      break;

    case 2:
      // Type 2: Current Router querying for information about Clients from Forwarding Table
      console.log("Router querying for Clients");

      // Query data on this router from Flow Table
      routerId = receivedMessage.routerId;
      let routerData = FlowTable.get(routerId);
      let [ routerIn, routerOut ] = <String[]>routerData;
      sendMessage = { routerIn, routerOut, routerId };
      messageType = 4;
      break;

    case 3:
      // Type 3: Client connecting to Router to get information about Forwarding Table
      console.log("Client connecting to Switcher");
      messageType = 3;

        // Get first Router in Routers list
        var it = Routers.values();
        
        let firstRouter = it.next().value;
        // TODO: If no Routers are active, save Client details and notify once a Router is connected
        if(!firstRouter) return sendMessage = { message: "No Routers active on Network" };
        else if(clientCount == 0) {
          console.log("Initial Client Connected");
          sendMessage = JSON.parse(firstRouter);
        } else if(clientCount == 1) {
          console.log("Receiving Client Connected");
          // Store Client details for later use by last router
          receivingClient.ip = address;
          receivingClient.port = port;
          sendMessage = "You are the receiving Client";
        } else {
          console.log("Additional Client connected, no space in Flow Table");
          sendMessage = "You are not connected to the Network, no space.";
        }
        clientCount++;

  }

  // Send message to Client
  let message = prepareMessage(messageType, { origin: "switcher", serverTime: new Date(), message: sendMessage });
  sendMessageToRouter(message, address, port);
});

// Send message to Router
function sendMessageToRouter(message: Buffer, address: string, port: number): void {
  Switcher.send(message, port, address, (err) => {
    if (err) {
      console.log('Error sending data')
      Switcher.close();
    } else {
      console.log('Data sent')
    }
  });
}

// Prepare message to be sent to Router
function prepareMessage(type: number, message: any) {
  return Buffer.from(JSON.stringify({ type, message }));
}


/** Broadcast Information from Server to all Clients */
interface Client {
  address: string;
  port: number
}
interface Router extends Client {
  in?: Router | Client;
  out?: Router | Client;
  routerId: String;
}

let Routers: Set<string> = new Set();

function newClient({ address, port, routerId }: Router) {
  return JSON.stringify({ address, port, routerId });
}

function broadcast(broadcastMessage: string) {
  console.log("Broadcasting message to all Clients")

  var message = Buffer.from(JSON.stringify({ type: 'Switcher', message: broadcastMessage }));
  const ClientList = Array.from(Routers);
  if (ClientList.length == 0) console.log("No active Clients");

  for (let clientNumber in ClientList) {
    const { address, port } = JSON.parse(ClientList[clientNumber]);
    sendMessageToRouter(message, address, port);
  }
}

/** Launch UDP Socket and HTTP Servers, and listen on given port */
try {
  Switcher.on('listening', (): void => {
    const address = Switcher.address();
    console.log(`Switcher Server listening ${address.address}:${address.port}`);
  });

  Switcher.bind(socketPort, (): void => {
    // setInterval(() => {
    //   broadcast('Swticher is active')
    //   console.log(Routers)
    // }, 5000)
    console.log(`Switcher UDP Datagram Server is active at ws://localhost:${socketPort}`);
  });

} catch (error: any) {
  console.error(`An error occurred with starting Server ${error.toString()}`);
}