<template>
    <div class="menu-item" v-bind:class="{ active }" @click="onClick()">
      <slot>
        <font-awesome-icon :icon="icon"></font-awesome-icon>
      </slot>
    </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
import Menu from "./Menu.vue";
import MenuItemGroup from "./MenuItemGroup.vue";

  /** A component to make menu items have consistant styling */
  @Component({ name: 'menu-item' })
  export default class MenuItem extends Vue {
    @Prop() title!: string;
    @Prop() icon!: string;
    @Prop() active!: boolean;
    @Prop({default: true}) selectable = true;

    private onClick () {
      this.$emit('click', this);

      if (this.selectable && (this.$parent instanceof MenuItemGroup || this.$parent instanceof Menu)) this.$parent.select(this);
    }

    select(onlyThis?: boolean) {
      if (onlyThis&& (this.$parent instanceof MenuItemGroup || this.$parent instanceof Menu))
        this.$parent.deselectAll(this);
    }
  }
</script>
<style lang="scss">

  .menu-item {
    cursor: pointer;
    height: $menu-item-height;
    min-width: $menu-item-width;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: grey;
    }

    &.active {
      color: $primary;
    }
  }

</style>
