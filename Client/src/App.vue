<template>
  <div>
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <n-space vertical>
      <n-card>
        <n-form>
          <n-form-item-row label="Peer">
            <n-mention :options="peerOptions" default-value="@" />
          </n-form-item-row>
          <n-form-item-row label="Router">
            <n-mention :options="routerOptions" default-value="@" />
          </n-form-item-row>
          <n-form-item-row label="Message">
            <n-input maxlength="30" show-count clearable />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block>Connect and Send</n-button>
      </n-card>
    </n-space>

    <n-card title="Messaging">
      <!-- <n-log
        :rows="5"
        :log="1234
        1
        eee
        "
      /> -->
    </n-card>
    <!-- <var-button type="primary">Primary Button</var-button> -->
    <!-- <hello-world-vue :count="1" /> -->
  </div>
</template>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import * as Client from './Client';
import HelloWorldVue from "./components/HelloWorld.vue";

const Dgram = require('dgram');
const socketPort: number = 51510;
const message = Buffer.from('UDP CONNETION DATA');


/** Initialise UDP Socket */
const client = Dgram.createSocket('udp4');

/** Send message to Server */
client.send(message, socketPort, 'localhost', (err: any) => {
  if (err) {
    console.log('Error sending data to Server')
    client.close();
  } else {
    console.log('Data sent to Server')
  }
});

/** Listen and handle incoming messages from Server */
client.on('message', (msg: Buffer, info: any) => {
    console.log(`Data received from server: ${msg.toString()}`);
    console.log(`Received ${msg.length} bytes from ${info.address}:${info.port}\n`);
});

export default {
  name: "App",
  components: {
    HelloWorldVue,
  },
  data() {
    return {
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
};

// console.log({ Client })
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
