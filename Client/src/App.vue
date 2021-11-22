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

// Import dependencies and initialise UDP Datagram Socket
const Dgram = require("dgram");
const client = Dgram.createSocket("udp4");

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
    };
  },
  methods: {
    formSubmit: function () {
      const { message } = formModelRef.value;
      if (message.length < 1) return alert("Form not completed");
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
      this.sendMessage(5, { message }, this.routerIp, this.routerPort);
      this.logMessage(`Sending message '${message}' to peer through router 1.`);
    },

    getInformationFromSwitcher: function () {
      // Get information from switcher
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
    // Connect to Switcher
    this.getInformationFromSwitcher();

    /** Listen and handle incoming messages from Server */
    client.on("message", (msg: Buffer, info: any) => {
      console.log(`Data received from server: ${msg.toString()}`);
      let { type, message: receivedMessage } = JSON.parse(Buffer.from(msg).toString());

      let message = receivedMessage?.message;
      if (type == 3) {
        // Type 3: Message from Switcher
        console.log(`Received message from Switcher: ${receivedMessage}`);
        if (message.count === 0 || message.count === 1) {
          this.routerIp = message.router.address;
          this.routerPort = message.router.port;
          this.clientIp = message.client.address;
          this.clientPort = message.client.port;
          this.hasFirstRouter = true;
          this.logMessage(message.message);
        }
      } else if (type === 5) {
        // Type 5: Received Message from Router
        this.logMessage(
          `Received message from Client through Network of Routers: ${message}, more details: ${JSON.stringify(
            message
          )}`
        );
      } else {
        this.logMessage(
          `Received message from Switcher: ${
            message.message
          }, more details: ${JSON.stringify(message)}`
        );
      }
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
