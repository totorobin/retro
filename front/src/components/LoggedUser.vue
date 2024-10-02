<template>
  <div>
    <div>user : <div pw-id="user-card">{{ userName }}</div></div>
  </div>
</template>
<script setup lang="ts">

import {useUserStore} from "../stores/users.ts";
import {computed } from "vue";

const userStore = useUserStore()
const userName = computed(() => userStore.me?.name || '')

</script>