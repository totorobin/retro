<template>
  <div>
    <div v-for="user in users" :class="{ disconnected: !user.loggedIn, me: user.uuid === me.uuid}" class="user" @click="() => $emit('focusUser', user.uuid)">
      <UserPicture :modelValue="user" />
      <font-awesome-icon :icon="faCircle" class="dot" size="xs" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {User} from "@retro/shared";
import {useUserStore} from "../stores/users.ts";
import {computed} from "vue";
import UserPicture from "./UserPicture.vue";

defineProps<{
  users: Array<User>
}>()

defineEmits<{
  focusUser: [userId :string]
}>()


const userStore = useUserStore()
const me = computed(() => userStore.me)

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
    font-size: 7px;
    color: darkgreen;
  }
}

.me::before {
  font-size: small;
  content: "vous";
  position: absolute;
  margin-right: 34px;
  margin-top: 7px;
  right: 0;
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