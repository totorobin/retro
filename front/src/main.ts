import {createApp} from "vue";
import "./style.css";
import App from "./App.vue";
import {createPinia} from "pinia";
import vue3GoogleLogin from "vue3-google-login";
import router from "./router";

const app = createApp(App);
app.use(router);
app.use(vue3GoogleLogin, {
    clientId:
        "337655515304-0bjq5sbn6ddai2a8roodjou25ngo3psu.apps.googleusercontent.com",
});
app.use(createPinia());
app.mount("#app");

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // dark mode
    document.body.classList.add("dark-mode");
}