
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

Server.on('message', (msg, senderInfo) => {
    // console.log(msg.toString))
    const { type, message } = JSON.parse(msg.toString());
    console.log({ type, message })
    // console.log({ message: message.toString(), senderInfo });
});

/** Create router and send information to Switcher (IP and PORT) */
function connectToSwitcher() {
    // const routerPort: number =  Math.floor((Math.random() * 10) + 1);
    const message = Buffer.from('Router connecting to Switcher')
    Server.send(message, socketPort, 'localhost', (err) => {
        if (err) {
            console.log('Error sending data to Server')
            Server.close();
        } else {
            console.log('Data sent to Server')
        }
    });
}

connectToSwitcher();



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