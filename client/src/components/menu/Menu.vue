<template>
    <component :is="tag" class="menu" v-drag="{ handle: '#handle' }">
      <span id="handle">handle</span>
      <slot>
      <!-- looks like:
        <menu-item />
        <menu-item />
        <menu-group>
          <menu-item />
          <menu-item />
        </menu-group>
        <menu-item />
      -->
      </slot>
    </component>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import drag from "v-drag";
  import MenuItem from "./MenuItem.vue";

  Vue.use(drag);

  /** A component to make menus have consistant styling and be movable */
  @Component
  export default class Menu extends Vue {
    tag = 'div'; // so we can change it to nav or some shiz
  }

</script>
<style lang="scss">
  .menu {
    z-index: 10000;
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
    border: 2px solid black;
    border-radius: 15px;

    position: absolute !important;
    background-color: $menu-bg;
  }
  #handle {
    user-select: none;
  }
</style>
