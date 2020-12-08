<template>
    <component :is="tag" class="menu" v-drag="'#handle'" ref="menu">
      <div id="handle" @mouseup="checkPos()">
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

    checkPos() {
      const menu = this.$refs.menu as HTMLElement;
      const rect = menu.getBoundingClientRect();

      //check that we're on the screen /** this didnt work, if anyone want's to fix it, pls do */
      // if ( rect.right > window.innerWidth ) /* too right */
      //   menu.style.left = `${window.innerWidth - rect.width}`;
      // if ( rect.left < 0 ) /* too left */
      //   menu.style.left = '0';
      // if ( rect.right > window.innerHeight ) /* too left */
      //   menu.style.top = `${window.innerHeight - rect.height}`;
      // if ( rect.right < 0 ) /* too left */
      //   menu.style.top = '0';
      const x = rect.left + (rect.width / 2)
      if (x > (window.innerWidth / 2)) {
        menu.classList.remove('left');
        menu.classList.add('right');
      } else {
        menu.classList.remove('right');
        menu.classList.add('left');
      }

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
