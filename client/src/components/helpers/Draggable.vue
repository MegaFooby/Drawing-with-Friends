<template>
    <component :is="tag" class="menu" v-drag="'#handle'">
      <div class="topper">
        <div id="handle">
          <font-awesome-icon icon="grip-lines"></font-awesome-icon>
        </div>
        <div>
          <font-awesome-icon icon="times-circle" v-if="closable" @click="$emit('on-close', $event)"></font-awesome-icon>
        </div>
      </div>
      <slot />
    </component>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";

  /** A component to make draggables have consistant styling and be movable */
  @Component
  export default class Draggable extends Vue {
    @Prop() closable = false;
  }

</script>
<style lang="scss">
  .menu {
    z-index: 10000;
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: fit-content;
    border: $border-style;
    border-radius: 1rem;

    position: absolute !important;
    background-color: $menu-bg;
  }
  #handle {
    user-select: none;
  }
  .topper {
    display:flex;
    justify-content: space-between;
  }
</style>
