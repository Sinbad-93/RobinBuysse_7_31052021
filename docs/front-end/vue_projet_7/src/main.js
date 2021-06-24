import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css'       //theme
import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons
import Button from 'primevue/button';
import Message from 'primevue/message';
import router from "./router";
import store from "./store";


const app = createApp(App);

app.use(PrimeVue);
app.component('Button', Button);
app.component('Message', Message);

app.use(store);
app.use(router);

app.mount("#app");
