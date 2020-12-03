import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import RoomMenu from "../components/RoomMenu.vue";
import Canvas from "../components/Canvas.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/rooms",
    name: "Rooms",
    component: RoomMenu,
  },
  {
    path: "/room/:id",
    name: "Canvas",
    component: Canvas,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
