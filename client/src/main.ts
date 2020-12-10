import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";

import loadIcons from "./icons";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);
import vuetify from "./plugins/vuetify";

import drag from "v-drag";
Vue.use(drag);

Vue.config.productionTip = false;

// lets us ignore some errors thrown from the movable lib FOR NOW
(window as any).data.move = { style: {}}

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);

loadIcons();

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
