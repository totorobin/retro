import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./pages/HomeView.vue";
import RoomView from "./pages/BoardView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/r/:boardId", component: RoomView, props: true },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
