<template>
  <div>
    <div class="row" v-for="p in players" :key="p.uuid"><div>{{ p.name + (p.uuid === me?.uuid ? ' (vous) ': '') }}</div><div>{{ ( p.loggedIn ? '🔗' : '⛓️‍💥')}}</div></div>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "../stores/users.ts";
import {computed} from "vue";

const userStore = useUserStore()
const players = computed(() => userStore.users)
const me = computed(() => userStore.me)

</script>

<style lang="css" scoped>
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;
}
</style>