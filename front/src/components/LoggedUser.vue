<template>
  <div class="loggedUser">
    <img :src="picture" /><div pw-id="user-card">{{ userName }}</div>
  </div>
</template>
<script setup lang="ts">

import {useUserStore} from "../stores/users.ts";
import {computed } from "vue";

const userStore = useUserStore()
const userName = computed(() => userStore.me?.name || '')
const picture = computed(() => userStore.me?.picture || '')

</script>

<style lang="css" scoped>
.loggedUser {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  border: whitesmoke solid 1px;
  border-radius: 5px;
}
img {
  margin: 5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.loggedUser div {
  margin: 5px;
}
</style>