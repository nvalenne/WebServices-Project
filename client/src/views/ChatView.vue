<template>
  <div id="frame" class="container">
    <h1>Live Chat</h1>
    <p>Discutez avec les gens, faites des rencontres,... Enjoy :)</p>
    <div id="messages">
    </div>
    <div class="input">
      <v-text-field
          label='Votre message'
          v-model="message"
          id="inputMsg"
      ></v-text-field>
      <v-icon color="blue" class="sendButton" @click="sendMessage">mdi-send</v-icon>
    </div>
  </div>
</template>

<script>
import {io} from "socket.io-client";
export default {
  data() {
    return {
      message: '',
    }
  },
  created() {
    this.socket = io('http://localhost:3000')
    this.socket.on('my broadcast', (data) => {
      const message = document.createElement('span')
      message.innerText = data
      message.style.margin = '5px'
      message.style.padding = '10px'
      message.style.border = '2px solid black'
      message.style.borderRadius = '10px'
      message.style.boxShadow = '-4px 5px 0px -1px rgba(52, 52, 52, 1)';
      document.getElementById("messages").appendChild(message)
      console.log(data)
    });
  },
  beforeDestroy() {
    this.socket.disconnect()
  },
  methods: {
    sendMessage() {
      if (this.message) {
        this.socket.emit('my message', {
          user: JSON.parse(this.$cookie.get('userAuthentificated')).username,
          message: this.message
        });
        this.message = ''
      } else {
        alert('Vous devez écrire un message')
      }
    }
  }
}
</script>

<style scoped>
#frame {
  display: flex;
  font-size: 18px;
  flex-flow: column nowrap;
}
#messages {
  display: flex;
  flex-flow: column nowrap;
  height: 600px;
  overflow: auto;
}
#messages span {
  margin: 15px;
}
.input {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-flow: row wrap;
}
.sendButton {
  cursor: pointer;
}
</style>