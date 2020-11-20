<template>
    <div class="menu-item" v-bind:class="{ active }" @click="$emit('click')">
      <slot />
    </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  /** A component to make menu items have consistant styling */
  @Component({ name: 'menu-item' })
  export default class Menu extends Vue {
    @Prop() title!: string;
    @Prop() icon!: string;
    @Prop() active!: boolean;
  }
</script>
<style lang="scss">

  .menu-item {
    cursor: pointer;
    height: $menu-item-height;
    min-width: $menu-item-width;

    &:hover {
      color: grey;
    }

    &.active {
      color: $primary;
    }
  }

</style>
