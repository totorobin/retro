import {createRouter, createWebHistory} from "vue-router";

import HomeView from "./pages/HomeView.vue";
import RoomView from "./pages/BoardView.vue";

import { useBoardStore } from "./stores/board.ts";


const routes = [
    {path: "/", component: HomeView},
    {
        path: "/r/:boardId",
        component: RoomView,
        props: true,
        beforeEnter: (to, from) => {
            console.log("beforeEnter",to,from);
            if(!to.params.boardId){
                console.log("no boardId");
                return false
            }
            const { joinBoard } = useBoardStore();
            joinBoard(to.params.boardId);
        },
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
