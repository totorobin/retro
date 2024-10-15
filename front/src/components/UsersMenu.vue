<template>
  <div>
    <div v-for="user in users"  class="user" :class="{ disconnected: !user.loggedIn}">
      <img :src="user.picture" :title="user.name"  :alt="user.name"/><font-awesome-icon class="dot" :icon="faCircle" size="xs"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import {User} from "@retro/shared";

defineProps<{
  users: Array<User>
}>()

</script>

<style lang="css" scoped>
.user {
  position: relative;
  text-align: center;
  width: 30px;
  height: 30px;
  margin: 10px;
  img {

     width: 30px;
     height: 30px;
     border-radius: 50%;
  }
  .dot {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: small;
    color: darkgreen;
  }
}
.disconnected {
  img {
    opacity: 50%;
  }
  .dot {
    color: darkred;
  }
}
</style>