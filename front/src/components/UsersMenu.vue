<template>
  <div class="userMenuList">
    <div v-for="user in users"
         class="user"
         :class="{
            disconnected: !user.loggedIn,
            me: user.uuid === me.uuid,
            focused: focusedUser == user.uuid,
         }"
         :style='{
            "--username": "\"" + user.name + "\""
         }'
         @click="() => $emit('focusUser', focusedUser == user.uuid?null:user.uuid)"
    >
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
  users: Array<User>,
  focusedUser: string,
}>()

defineEmits<{
  focusUser: [userId: string]
}>()


const userStore = useUserStore()
const me = computed(() => userStore.me)

</script>

<style lang="css" scoped>
.userMenuList {
  user-select: none;
}
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

  ::before {
		font-size: small;
		position: absolute;
		margin-right: 34px;
		top: 0;
		right: 0;
		bottom: 0;
		line-height: normal;
    content: var(--username);
  }
  :not(:hover)::before {
    content: "";
  }
}
.user.focused {
  margin-left: -5px;
  ::after {
    content: "🔍";
    position: absolute;
    bottom: 0;
    left: 90%;
  }
}

.disconnected {
  .user {
    opacity: 50%;
  }

  .dot {
    color: darkred;
  }
}
</style>