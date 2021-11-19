
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

Router.on('message', (msg, senderInfo) => {
    // console.log(msg.toString))
    const { type, message } = JSON.parse(msg.toString());
    console.log({ type, message })
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