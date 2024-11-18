<script setup lang="ts">


import {type User} from "@retro/shared";
import { ref} from "vue";

const model = defineModel<User>({required: true})
const loadingFailed = ref(false);
</script>

<template>
  <img v-if="!loadingFailed" :alt="model.name" :src="model.picture" :title="model.name" @error="() => loadingFailed = true">
  <div v-else class="initials" :style="{'background-color': `hsl(${parseInt(model.uuid) % 360}, 50%, 50%)` }">{{ model.name.split(' ').map(w => w[0].toUpperCase()).join('') }}</div>
</template>

<style scoped>
img, .initials {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  font-size: 15px;
  font-family: cursive;
}
</style>