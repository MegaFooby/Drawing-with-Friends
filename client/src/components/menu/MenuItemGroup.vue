<template>
    <div class="menu-item-group">
      {{title}}
      <div class="group">
        <slot />
      </div>
    </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  /** A component to make menu items have consistant styling */
  @Component({ name: 'menu-group' })
  export default class Menu extends Vue {
    @Prop({default: 'More'}) title!:string;
    @Prop() icon!: string;
  }
</script>
<style lang="scss">

  .menu-item-group {
    height: $menu-item-height;

    .group {
      display: none;
      background: $menu-group-bg;
      border-radius: 15px;
    }
    &:hover {
      height: fit-content;
      .group {
        display: flex;
        flex-direction: column;
      }
    }
  }
</style>
