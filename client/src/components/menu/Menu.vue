<template>
    <component :is="tag" class="menu" v-drag="'#handle'">
      <div id="handle">
        <font-awesome-icon icon="grip-lines"></font-awesome-icon>
      </div>
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
  import MenuItem from "./MenuItem.vue";


  /** A component to make menus have consistant styling and be movable */
  @Component
  export default class Menu extends Vue {
    tag = 'div'; // so we can change it to nav or some shiz

    select(mi: MenuItem) {
      console.log('selected', mi.icon);
    }

    deselectAll(except?: MenuItem) {
      //TODO iterate through all children and deselct if not except
    }
  }

</script>
<style lang="scss">
  .menu {
    z-index: 10000;
    display: flex;
    flex-direction: column;
    width: 2rem;
    height: fit-content;
    border: $border-style;
    border-radius: 1rem;

    position: absolute !important;
    background-color: $menu-bg;
  }
  #handle {
    user-select: none;
  }
</style>
