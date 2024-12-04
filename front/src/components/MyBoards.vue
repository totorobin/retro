<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {useUserStore} from "../stores/users.ts";
import {onMounted, ref} from "vue";

const router = useRouter()
const {myBoards} = useUserStore()

const goToBoard = (boardId: string) => {
  router.push(`/r/${boardId}`)
}

const boards = ref([]);

onMounted(async () => boards.value = await myBoards());


</script>

<template>
  <div v-if="boards">
    <div v-for="board in boards" @click="goToBoard(board.uuid)">
      {{ board.uuid }}
    </div>
  </div>
</template>

<style scoped>

</style>