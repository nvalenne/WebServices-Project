<template>
  <div id="app">
    <div id="connexion">
      <div style="width:50%">
        <v-alert
            type="error"
            dense
            v-if="error"
        >
          {{error}}
        </v-alert>
        <v-card elevation="4" class="cardConnexion">
          <v-col cols="7">
            <div class="headerConnexion" style="margin-bottom: 15px;">
              <h2 class="mb-4">Connexion</h2>
              <img src="../assets/wheel.gif" style="width: 20%">
            </div>
            <div>
              <div id="formConnexion" >
                <label for="username">Nom d'utilisateur</label>
                <v-text-field type="text" id="username" v-model="form.username" required></v-text-field>
                <label for="password">Mot de passe</label>
                <v-text-field type="password" id="password" v-model="form.password" required></v-text-field>
                <v-btn color="success" @click="submitForm">Se connecter</v-btn>
              </div>
            </div>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="5">
            <h4>Vous souhaitez vous connecter avec un de ces services ?</h4>
            <div style="padding: 30px">
              <div class="mt-6 google-signin-button">
                <v-icon color="white">mdi-google</v-icon>
                <button v-google-signin-button="clientId">Continue with Google</button>
              </div>
              <div class="mt-6 github-signin-button">
                <v-icon color="white">mdi-github</v-icon>
                <button>Continue with GitHub</button>
              </div>
            </div>
          </v-col>
        </v-card>
      </div>
      <div>
        <br>
        <span>Vous n'avez pas de compte ? Cliquez <router-link to="/inscription">ici</router-link> pour vous le
          créer</span>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import {mapMutations} from "vuex";

export default {
  name: 'ConnectionView',
  metaInfo: {
    title: 'Connexion - Les Papiots'
  },
  data(){
    return {
      clientId: '50469353179-qtgc2htu7eb0ol7hqfc0536gskbmd01o.apps.googleusercontent.com',
      form: {
        username: '',
        password: ''
      },
      error:""
    }
  },
  methods: {
    ...mapMutations(['setUserConnected']),
    submitForm() {
      axios.post("http://localhost:3000/account/connexion", this.form)
          .then((user) => {
            //console.log(user.data.data);
            this.$cookie.set('userAuthentificated', JSON.stringify(user.data.data), 1);
            this.setUserConnected(JSON.parse(this.$cookie.get('userAuthentificated')));
            this.$router.push('/');
          })
          .catch((error) => {
            this.error = error.response.status + " : " + error.response.data.err;
            //console.log(error)
          })

    },
  },
  mounted() {
    let scriptOAuth = document.createElement('script')
    scriptOAuth.setAttribute('src', 'https://apis.google.com/js/platform.js')
    document.head.appendChild(scriptOAuth)
  }
}



</script>
<style scoped>
#connexion,
.headerConnexion,
#formConnexion {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.cardConnexion {
  display: flex;
  flex-direction: row;
  border-radius: 40px;
  padding: 10px 0 20px 0;
}
.google-signin-button {
  font-weight: bold;
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 10px;
  flex-flow: wrap row;
  color: white;
  text-align:center;
  background-color: #d71616;
  height: 40px;
  font-size: 16px;
  border-radius: 10px;
  padding: 0 15px
}

.github-signin-button {
  font-weight: bold;
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 10px;
  flex-flow: wrap row;
  color: white;
  text-align:center;
  background-color: #181717;
  height: 40px;
  font-size: 16px;
  border-radius: 10px;
  padding: 0 15px
}
</style>
