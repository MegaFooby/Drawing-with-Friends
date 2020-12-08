<template>
    <div class="menu-item-group">
      <div class="handle" ref="disp">
        <font-awesome-icon :icon="selectedIcon"></font-awesome-icon>
      </div>
      <!-- {{selectedIcon || icon || title}} -->
      <div class="group" v-bind:class="groupClass">
        <div class="handle">
          <font-awesome-icon :icon="selectedIcon"></font-awesome-icon>
        </div>
        <slot />
      </div>
    </div>
</template>
<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  import { Component, Prop, Vue } from "vue-property-decorator";
  import MenuItem from "./MenuItem.vue";

  /** A component to make menu items have consistant styling */
  @Component({ name: 'menu-group' })
  export default class MenuItemGroup extends Vue {
    @Prop({default: 'More'}) title!:string;
    @Prop({default: ''}) groupClass!: string | object;
    @Prop({default: 'question-circle'}) icon!: string;
    private iconKey = 1;
    private selectedItem!: MenuItem;

    get selectedIcon() {
      return this.selectedItem ? this.selectedItem.icon || this.selectedItem.title : this.icon;
    }

    select(mi: MenuItem) {
      this.selectedItem = mi;
      console.log('selected', mi.icon);
      //TODO: my idea here is to swap the group icon with whatever was just clicked
      //this.$refs.disp.
      //this.$createElement(FontAwesomeIcon, { props: { icon: this.selectedIcon } })
    }

    deselectAll(except?: MenuItem) {
      //TODO: iterate through children and deselect them
    }
  }
</script>
<style lang="scss">

  .menu-item-group {
    height: $menu-item-height;
    position: relative;

    .handle {
      height: $menu-item-height;
      min-width: $menu-item-width;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .group {
      .handle { align-self: baseline; }
      display: none;
      opacity: 0;

      background: $menu-group-bg;
      border-radius: $menu-item-radius;
      position: absolute;
      left: 0;
      top: 0;

      flex-direction: row;
      align-items: center;
      //padding-inline-start: 0.5rem;
      transition: opacity 0.3s;
    }
    &:hover {
      //height: fit-content;
      .group {
        display: flex;
        opacity: 1;
      }
    }
  }
</style>
