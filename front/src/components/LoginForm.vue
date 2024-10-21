<template>
  <div class="full-screen">
    <GoogleLogin :callback="login" auto-login popup-type="TOKEN" prompt>
      <div title="Connectez vous via Google">
        <font-awesome-icon :icon="faGoogle" class="loginButton" style=""/>
      </div>
    </GoogleLogin>
  </div>
</template>
<script lang="ts" setup>
import {useConnectionStore} from "../stores/connection.ts";
import {type CallbackTypes, GoogleLogin} from "vue3-google-login";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";

const {connect} = useConnectionStore()
const login: CallbackTypes.CredentialCallback | CallbackTypes.CodeResponseCallback | CallbackTypes.TokenResponseCallback = (res: {
  credential?: string,
  code?: string,
  access_token?: string
}) => {
  console.log(res)
  if (!res.credential && !res.code && !res.access_token) {
    console.log("erreur login google")
    return;
  }
  connect(res)
}
</script>
<style lang="css" scoped>
.full-screen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loginButton {
  color: var(--font-color);
  font-size: xxx-large;
  cursor: pointer;
}
</style>