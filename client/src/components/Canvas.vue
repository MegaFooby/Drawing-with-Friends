<template>
  <div>
    <button type="button" class="btn" @click="showModal">Settings</button>
    <modal v-show="isModalVisible" @close="closeModal" />
    <img alt="Vue logo" src="../assets/logo.png" />
    <canvas id="myCanvas" resize></canvas>
    <Menu tag="nav" class="drawing-palette">
      <menu-item-group title="Tools" icon="pencil-ruler" ref="tools">
        <menu-item @click="activate(pen, $event)" icon="pen" />
        <menu-item @click="activate(square, $event)" icon="square" />
        <menu-item @click="activate(circle, $event)" icon="circle" />
      </menu-item-group>
      <menu-item v-bind:active="fill" @click="fill = !fill" icon="fill-drip" />
      <menu-item @click="receive('')" icon="sync-alt" />
    </Menu>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import paper from "paper";
import Menu from "@/components/menu/Menu.vue";
import MenuItem from "@/components/menu/MenuItem.vue";
import MenuItemGroup from "@/components/menu/MenuItemGroup.vue";
import modal from "@/components/SettingsModal.vue";

@Component({
  components: {
    Menu,
    MenuItem,
    MenuItemGroup,
    modal
  }
})
export default class Canvas extends Vue {
  private color = "#000000";
  private fill = false;
  private width = 5;

  private path!: paper.Path;
  private scope!: paper.PaperScope;

  private pen!: paper.Tool;
  private square!: paper.Tool;
  private circle!: paper.Tool;
  private selected!: MenuItem;
  private isModalVisible = false;

  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup("myCanvas");

    this.pen = new paper.Tool();

    this.pen.onMouseDown = (event: paper.ToolEvent) => {
      this.path = new paper.Path();
      this.setPath(this.path);
      this.path.add(event.point);
    };
    this.pen.onMouseDrag = (event: paper.ToolEvent) => {
      this.path.add(event.point);
    };
    this.pen.onMouseUp = (event: paper.ToolEvent) => {
      this.path.simplify();
      this.send();
    };

    this.square = new paper.Tool();
    this.square.minDistance = 2;
    let startPoint: paper.Point;
    let xpositive: boolean, ypositive: boolean;
    this.square.onMouseDown = (event: paper.ToolEvent) => {
      this.path = new paper.Path.Rectangle(event.point, new paper.Size(1, 1));
      this.setPath(this.path);
      startPoint = event.point;
      xpositive = true;
      ypositive = true;
    };

    this.square.onMouseDrag = (event: paper.ToolEvent) => {
      let x = (event.point.x - startPoint.x) / this.path.bounds.width;
      let y = (event.point.y - startPoint.y) / this.path.bounds.height;
      if (!xpositive) x = -x;
      if (!ypositive) y = -y;
      xpositive = event.point.x - startPoint.x >= 0;
      ypositive = event.point.y - startPoint.y >= 0;
      if (x != 0 && y != 0) {
        this.path.scale(x, y, startPoint);
      }
    };

    this.square.onMouseUp = this.send;

    this.circle = new paper.Tool();
    this.circle.minDistance = 2;
    this.circle.onMouseDown = (event: paper.ToolEvent) => {
      this.path = new paper.Path.Ellipse(
        new paper.Rectangle(event.point, new paper.Size(1, 1))
      );
      this.setPath(this.path);
      startPoint = event.point;
      xpositive = true;
      ypositive = true;
    };

    this.circle.onMouseDrag = (event: paper.ToolEvent) => {
      let x = (event.point.x - startPoint.x) / this.path.bounds.width;
      let y = (event.point.y - startPoint.y) / this.path.bounds.height;
      if (!xpositive) x = -x;
      if (!ypositive) y = -y;
      xpositive = event.point.x - startPoint.x >= 0;
      ypositive = event.point.y - startPoint.y >= 0;
      if (x != 0 && y != 0) {
        this.path.scale(x, y, startPoint);
      }
    };

    this.circle.onMouseUp = this.send;
  }

  //run this at every onMouseUp to send this to the server
  send() {
    const json = this.path.exportJSON([true, 5]); //number is float precision
    //send json to server
  }

  receive(json: string) {
    json =
      '["Path",{"applyMatrix":true,"segments":[[431,319],[431,85],[968,85],[968,319]],"closed":true,"strokeColor":[0,0,0]}]';
    const p = new paper.Path();
    p.importJSON(json);
  }

  setPath(path: paper.Path) {
    path.strokeColor = new paper.Color(0, 0, 0);
    path.strokeWidth = this.width;
    path.strokeCap = "round";
    if (this.fill) path.fillColor = new paper.Color(0, 0, 0);
  }

  activate(tool: paper.Tool, $e: MenuItem) {
    tool.activate();
  }

  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
</script>
<style>
body {
  height: 100%;
}

canvas[resize] {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

a {
  padding-right: 4px;
}

.drawing-palette {
  top: 50vh;
  left: 0;
}

.btn {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
}
</style>
