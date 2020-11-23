import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import loadIcons from "./icons";

Vue.config.productionTip = false;

// lets us ignore some errors thrown from the movable lib FOR NOW
(window as any).data.move = {}

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);

loadIcons();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
