<template>
  <div>
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <n-space vertical>
      <n-card>
        <n-form :model="userModel" ref="userRef" :rules="userRules">
          <n-form-item-row label="Peer" path="peer">
            <n-mention :options="peerOptions" default-value="@" v-model:value="userModel.peer" />
          </n-form-item-row>
          <n-form-item-row label="Router" path="router">
            <n-mention :options="routerOptions" default-value="@" v-model:value="userModel.router" />
          </n-form-item-row>
          <n-form-item-row label="Message">
            <n-input maxlength="30" show-count clearable v-model:value="userModel.message" />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" v-on:click="formSubmit()">Connect and Send</n-button>
      </n-card>
    </n-space>

    <n-card title="Messaging">
      <n-log
        :rows="5"
        :log="userLog"
      />
    </n-card>
  </div>
</template>

<script lang="ts">
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

import { ref } from 'vue';
import { useMessage } from 'naive-ui'

const formModelRef = ref({
  peer: '@',
  router: '@',
  message: ''
})

const userRules = {
      peer: {
        trigger: ['input', 'blur'],
        required: true,
        message: 'Peer is required',
        validator() {
          if(formModelRef.value.peer == "@") {
            return Error('Peer is required')
          }
        }
      },
      router: {
        router: ['input', 'blur'],
        required: true,
        message: 'Router is required',
        validator () {
          if (formModelRef.value.router == "@") {
              return Error('Only one router allowed')
          }
        }
      },
      message: {
        
      }
    }

export default {
  name: "App",
  components: {
    HelloWorldVue,
  },
  data: () => {
    return {
      userModel: formModelRef,
      userRules,
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
    formSubmit: function() {
      const { peer, router, message } = formModelRef.value;
      if(peer.length == 1 || router.length == 1 || message.length < 1) return alert('Form not completed');
      console.log({ peer, router, message });
      this.userLog = `${(new Date().toTimeString().substring(0, 8))} Sending message '${message}' to peer ${peer} through router ${router}.\n` + this.userLog; 
    }
  }
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
