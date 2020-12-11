<template>
  <div class="home">
    <!--<img alt="Vue logo" src="../assets/logo.png" /> I moved this to the Canvas component-->
    <Canvas />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Canvas from "@/components/Canvas.vue"; // @ is an alias to /src

@Component({
  components: {
    Canvas
  }
})
export default class Home extends Vue {}
</script>
