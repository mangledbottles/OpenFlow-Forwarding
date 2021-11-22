<template>
  <div>
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <n-row>
      <n-col :span="12">
        <n-statistic label="IP">{{ clientIp }}</n-statistic>
      </n-col>
      <n-col :span="12">
        <n-statistic label="Port">{{ clientPort }}</n-statistic>
      </n-col>
    </n-row>
    <n-space vertical>
      <n-card>
        <n-form :model="userModel" ref="userRef">
          <!-- <n-form-item-row label="Peer" path="peer">
            <n-mention
              :options="peerOptions"
              default-value="@"
              v-model:value="userModel.peer"
            />
          </n-form-item-row>
          <n-form-item-row label="Router" path="router">
            <n-mention
              :options="routerOptions"
              default-value="@"
              v-model:value="userModel.router"
            />
          </n-form-item-row> -->
          <n-form-item-row label="Message">
            <n-input
              maxlength="30"
              show-count
              clearable
              v-model:value="userModel.message"
            />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" v-on:click="formSubmit()"
          >Connect and Send</n-button
        >
      </n-card>
    </n-space>

    <n-card title="Messaging">
      <n-log :rows="5" :log="userLog" />
    </n-card>
  </div>
</template>

<script lang="ts">
// import * as Client from './Client';
import HelloWorldVue from "./components/HelloWorld.vue";

// /** Send message to Server */
// client.send(message, socketPort, 'localhost', (err: any) => {
//   if (err) {
//     console.log('Error sending data to Server')
//     client.close();
//   } else {
//     console.log('Data sent to Server')
//   }
// });
const Dgram = require("dgram");
const client = Dgram.createSocket("udp4");

// import * as Dgram from "dgram";

import { ref } from "vue";
import { useMessage } from "naive-ui";

const formModelRef = ref({
  message: "",
});

export default {
  name: "App",
  components: {
    HelloWorldVue,
  },
  data: () => {
    return {
      client: null,
      hasFirstRouter: false,
      routerIp: null,
      routerPort: null,
      clientIp: null,
      clientPort: null,
      socketPort: 51510,
      userModel: formModelRef,
      userLog: "\n",
      peerValue: "a",
      peerOptions: [
        {
          label: "Alice",
          value: "alice",
        },
        {
          label: "Bob",
          value: "bob",
        },
        {
          label: "Admin",
          value: "admin",
        },
      ],
      routerOptions: [
        {
          label: "Router 1",
          value: "R1",
        },
        {
          label: "Router 2",
          value: "R2",
        },
        {
          label: "Router 3",
          value: "R3",
        },
        {
          label: "Router 4",
          value: "R4",
        },
      ],
    };
  },
  methods: {
    formSubmit: function () {
      const { message } = formModelRef.value;
      if (message.length < 1)
        return alert("Form not completed");
      // console.log({ peer, router, message });

      if (!this.hasFirstRouter) {
        this.getInformationFromSwitcher();

        return (
          this.logMessage(
            `Initial Router has not been detected on the Switcher Netowrk`
          ),
          this.logMessage(`Requesting information from Switcher for Router 1`)
        );
      }
      // Send message
      // let sendMessage = Buffer.from("UDP CONNETION DATA");
      this.sendMessage(
        5,
        { message },
        this.routerIp,
        this.routerPort
      );

      this.logMessage(
        `Sending message '${message}' to peer through router 1.`
      );
    },
    getInformationFromSwitcher: function () {
      // Get information from switcher
      // let sendMessage = Buffer.from("UDP CONNETION DATA");
      console.log("getting information from switcher");
      this.sendMessage(
        3,
        "client connecting to switcher",
        "localhost",
        this.socketPort
      );
    },
    sendMessage: function (type, message, ip, port) {
      let sendMessage = this.prepareMessage(type, message);
      console.log({ sendMessage, cli: this.client });
      client.send(sendMessage, port, ip, (err: any) => {
        if (err) {
          console.log("Error sending data");
          client.close();
        } else {
          console.log("Data sent");
        }
      });
    },
    createNewClient: function () {
      console.log("closing client");
      this.client.close();
    },
    prepareMessage: function (type, message) {
      return Buffer.from(JSON.stringify({ type, message }));
    },
    logMessage: function (message) {
      this.userLog =
        `${new Date().toTimeString().substring(0, 8)} ${message}\n` +
        this.userLog;
    },
  },
  updated() {
    this.createNewClient();
  },
  mounted() {
    const socketPort: number = 51510;
    // const message = Buffer.from("UDP CONNETION DATA");
    // /** Initialise UDP Socket */
    // const client = Dgram.createSocket("udp4");
    this.client = client;

    // Connect to Switcher
    this.getInformationFromSwitcher();

    /** Listen and handle incoming messages from Server */
    client.on("message", (msg: Buffer, info: any) => {
      console.log(`Data received from server: ${msg.toString()}`);
      let { type, message: receivedMessage } = JSON.parse(msg.toString());

      if (type == 3) {
        // Type 3: Message from Switcher
        console.log(`Received message from Switcher: ${receivedMessage}`);
        // this.logMessage(`Received message from Switcher: ${JSON.stringify(receivedMessage)}`);
        let message = receivedMessage.message;
        if (message.address && message.port) {
          this.routerIp = message.address;
          this.routerPort = message.port;
          this.hasFirstRouter = true;
          this.logMessage(`You are the initial client. Router 1 has been detected on the Switcher Network, message: ${JSON.stringify(message)}`);
        } else {
          this.logMessage(
            `Received message from Switcher: ${JSON.stringify(message)}`
          );
        }
      }
      // this.logMessage(`Received ${msg.length} bytes from ${info.address}:${info.port}`);

      // console.log(
      // `Received ${msg.length} bytes from ${info.address}:${info.port}\n`
      // );
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
