
/** Import dependecies */
import dgram from "dgram";

/** Initialise UDP Socket */
const switcherPort: number = 51510;
const Router = dgram.createSocket('udp4');

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

/** Create router and send information to Switcher (IP and PORT) */
function connectToSwitcher() {
    // const routerPort: number =  Math.floor((Math.random() * 10) + 1);
    const message = Buffer.from('Router connecting to Switcher')
    Router.send(message, switcherPort, 'localhost', (err) => {
        if (err) {
            console.log('Error sending data to Server')
            Router.close();
        } else {
            console.log('Data sent to Server')
        }
    });
}

connectToSwitcher();


// Prepare message to be sent to Switcher
function prepareMessage (type: number, message: any) {
    return Buffer.from(JSON.stringify({ type, message }));
}

// /** Launch UDP Socket and HTTP Servers, and listen on given port */
// try {
//     Server.on('listening', (): void => {
//       const address = Server.address();
//       console.log(`Router listening ${address.address}:${address.port}`);
//     });

//     Server.bind(socketPort, (): void => {
//         connectToSwitcher();
//       console.log(`Router UDP Datagram Server is active at http://localhost:${socketPort}`);
//     });

//   } catch (error: any) {
//     console.error(`An error occurred with starting Server ${error.toString()}`);
//   }