import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "./pages/HomeView.vue";
import RoomView from "./pages/RoomView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/r/:roomId", component: RoomView, props: true },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
