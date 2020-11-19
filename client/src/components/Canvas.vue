<template>
  <div>
    <a href="#" @click="pen.activate()">Pen</a>
    <a href="#" @click="square.activate()">Square</a>
    <a href="#" @click="circle.activate()">Circle</a>
    <a href="#" @click="fill = !fill">Fill</a>
    <a href="#" @click="receive('')">Receive</a>
    <canvas id="myCanvas" resize></canvas>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import paper from "paper";

@Component
export default class Canvas extends Vue {
  private color = "#000000";
  private fill = false;
  private width = 5;

  private path!: paper.Path;
  private scope!: paper.PaperScope;

  private pen!: paper.Tool;
  private square!: paper.Tool;
  private circle!: paper.Tool;

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
      this.path = new paper.Path.Ellipse(new paper.Rectangle(event.point, new paper.Size(1, 1)));
      this.setPath(this.path);
      startPoint = event.point;
      xpositive = true;
      ypositive = true;
    }

    this.circle.onMouseDrag = (event: paper.ToolEvent) => {
      let x = (event.point.x - startPoint.x)/this.path.bounds.width;
      let y = (event.point.y - startPoint.y)/this.path.bounds.height;
      if(!xpositive) x = -x;
        if(!ypositive) y = -y;
        xpositive = (event.point.x - startPoint.x) >= 0;
        ypositive = (event.point.y - startPoint.y) >= 0;
        if(x != 0 && y != 0) {
          this.path.scale(x,y, startPoint);
        }
    }

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
}
</script>
<style>
body {
  height: 100%;
}

canvas[resize] {
  width: 100%;
  height: 100%;
}
</style>
