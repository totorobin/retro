<script setup lang="ts">


import {type User} from "@retro/shared";
import { ref} from "vue";

const user = defineModel<User>({required: true})
const loadingFailed = ref(false);
</script>

<template>
  <div :title="user.name">
    <div v-if="loadingFailed" class="initials" :style="{'background-color': `hsl(${parseInt(user.uuid) % 360}, 50%, 50%)` }">
      {{ user.name.split(' ').map(w => w[0].toUpperCase()).join('') }}
    </div>
    <img v-else :alt="user.name" :src="user.picture" @error="() => loadingFailed = true">
  </div>
</template>

<style scoped>
img, .initials {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border-radius: 50%;
}
img {
  user-drag: none;
  -webkit-user-drag: none;
}
.initials {
  font-size: 15px;
  font-weight: 750;
  font-family: sans-serif;
  text-align: center;
  user-select: none;
}
</style>