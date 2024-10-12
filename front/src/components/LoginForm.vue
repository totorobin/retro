<template>
  <div class="full-screen">
    <div>
      <GoogleLogin :callback="login" prompt auto-login >
        <div>Connectez vous via Google</div>
      </GoogleLogin>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useConnectionStore} from "../stores/connection.ts";
import {type CallbackTypes, GoogleLogin} from "vue3-google-login";

const { connect } = useConnectionStore()
const login : CallbackTypes.CredentialCallback = (res) => {
  console.log(res)
  if(!res.credential) {
    console.log("erreur login google")
    return;
  }
  connect(res.credential)
}
</script>
<style lang="css">
.full-screen {
  position: fixed;
  top:0;
  left:0;
  margin: 0;
  place-items: center;
  min-width: 100vw;
  min-height: 100vh;
  background-color: #242424;
  padding-top: 30%;
}
</style>