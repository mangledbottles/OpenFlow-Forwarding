
/** Import dependecies */
import dgram from "dgram";

/** Initialise UDP Socket */
const switcherPort: number = 51510;
const Router = dgram.createSocket('udp4');
let routerId: String;

/** Handle errors and close Socket */
Router.on('error', (err) => {
    console.log(`Server error:\n${err.stack}`);
    Router.close();
});

// TODO: How is Client meant to find out what Routers are connected to Switcher and their IP and Port??

// Listen for incoming messages from Clients and the Switcher
Router.on('message', (msg, senderInfo) => {
    // Type -1: An error has occured
    // Type 0: Message from Server - accepted this as new Router on network
    // Type 4: Message from Server - received information about a Client
    // Type 5: Message from Client - received message instructions from Client to send message over the network

    const { address, port } = senderInfo;
    let { type, message: receivedMessage } = JSON.parse(msg.toString());

    switch (type) {
        case 0:
            // Type 0: Message from Server - accepted this as new Router on network
            console.log("Switcher has accepted this Router");
            routerId = receivedMessage.message.routerId;
            let { address: routerAddress, port: routerPort } = receivedMessage.message;
            console.log(`Router active on ${routerAddress}:${routerPort}`);
            break;
        case 4:
            // Type 4: Message from Server - received information about a Client
            console.log("Switcher has sent information about a Client");
            break;
        case 5:
            // Type 5: Message from Client - received message instructions from Client to send message over the network
            console.log("Client has sent message instructions");

            // Request information about Clients from Switcher
            connectToSwitcher();
            break;
        default:
            console.log("Unknown Message Type received");
            break;
    }


    console.log(JSON.parse(msg.toString()));
    // const { origin, serverTime, messageCount, data, message } = JSON.parse(msg.toString());
    // console.log({ origin, serverTime, messageCount, data, message  })
    // console.log({ message: message.toString(), senderInfo });
});

// Connect router to Switcher
function connectToSwitcher() {
    if(routerId) return console.log("Router already connected to Switcher");
    const message = prepareMessage(1, "Router");
    sendMessageToSwitcher(message);
}

// Get information about Clients from Switcher from Flow Table
function getFlowTableFromSwitcher() {
    if(!routerId) return console.log("Router not connected to Switcher and cannot query");
    const message = prepareMessage(2, { routerId });
    sendMessageToSwitcher(message);
}

// Send message to Switcher
function sendMessageToSwitcher(message: Buffer) {
    Router.send(message, switcherPort, 'localhost', (err) => {
        if (err) {
            console.log('Error sending data to Server')
            Router.close();
        } else {
            console.log('Data sent to Server')
        }
    });
}

// Prepare message to be sent to Switcher
function prepareMessage (type: number, message: any) {
    return Buffer.from(JSON.stringify({ type, message }));
}


// Connect to Switcher
connectToSwitcher();

setTimeout(() => {
    // After 3 seconds, get information about Clients from Switcher Flow Table
    getFlowTableFromSwitcher();
}, 3000);