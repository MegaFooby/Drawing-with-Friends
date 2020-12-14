<template>
  <div @mousemove="mouseMove($event)">
    <canvas 
      id="myCanvas" 
      resize
      :class="[seletedCursor]"
    ></canvas>
    <Menu tag="nav" class="drawing-palette">
      <menu-item-group title="Tools" icon="pencil-ruler" ref="tools">
        <menu-item title="Pen Tool" @click="activate(pen, 'pen', $event)" icon="pen" />
        <menu-item title="Square Tool" @click="activate(square, 'square', $event)" icon="square" />
        <menu-item title="Circle Tool" @click="activate(circle, 'circle', $event)" icon="circle" />
        <menu-item title="Erase Tool" @click="activate(eraser, 'eraser', $event)" icon="eraser" />
      </menu-item-group>
      <menu-item :title="`${fill ? 'Disable':'Enable'} Fill Mode`" :active="fill" @click="fill = !fill" icon="fill-drip" />
      <menu-item title="Move Your View" :active="active(move)" @click="activate(move, 'move', $event)" icon="arrows-alt" />
      <menu-item title="Undo" @click="undo()" icon="undo-alt" />
      <menu-item-group
        icon="palette"
        :groupClass="{ 'color-picker-group': true }"
      >
        <div class="color-picker">
          <color-picker
            :visible-formats="['rgb']"
            :color="color.toCSS()"
            @color-change="updateColor"
            copy-button="copy"
          />
        </div>
      </menu-item-group>
    </Menu>
    <Chat 
      ref="chat"
    ></Chat>
  </div>
</template>
<script src="/socket.io/socket.io.js"></script>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ColorPicker } from "vue-accessible-color-picker";
import paper from "paper";

import SocketService from "../services/socket-io.service";

import Chat from "./Chat.vue";
import Menu from "./menu/Menu.vue";
import MenuItem from "./menu/MenuItem.vue";
import MenuItemGroup from "./menu/MenuItemGroup.vue";
import { Layer } from "paper/dist/paper-core";

const socket = SocketService.socket;


@Component({
  components: {
    Menu,
    MenuItem,
    MenuItemGroup,
    Chat,
    ColorPicker
  }
})
export default class Canvas extends Vue {
  @Prop({default: 'default'}) roomId!: string;
  private color = new paper.Color(0, 0, 0, 255);
  private fill = false;
  private width = 5;

  private path!: paper.Path;
  private scope!: paper.PaperScope;

  private pen = new paper.Tool();
  private square = new paper.Tool();
  private circle = new paper.Tool();
  private eraser = new paper.Tool();

  private captureMove = false;
  private showColours = true;

  private move = new paper.Tool();
  private mouse: {
    last?: paper.Point;
    event?: MouseEvent;
  } = {};

  private selected!: MenuItem;

  private layers = new Map();

  private cursors = {
    pen: "pencil-cursor",
    square: "cross-cursor",
    circle: "cross-cursor",
    eraser: "eraser-cursor",
    move: "grab-cursor"
  }

  private seletedCursor = "";

  created(){
    console.log("Current room id: "+this.roomId);

    socket.on('connected', (data) => {
        console.log("Server said: "+data.message);
    });

    socket.on('drawHistory', (history) => {                 // import canvas from server's database
      console.log("Recieving drawing database history");
      console.log(history);
      var drawing;
      for(drawing in history){
        if(!this.layers.has(history[drawing].user)) {
          this.layers.set(history[drawing].user, new paper.Layer());
          //this.scope.project.addLayer(this.layers.get(history[drawing].user));
          this.layers.get(this.$store.state.auth.user.username).remove();
          this.scope.project.layers.push(this.layers.get(this.$store.state.auth.user.username));
        }
        this.layers.get(history[drawing].user).activate();
        if(history[drawing].erase) {
          let i, line;
          let arr = JSON.parse(history[drawing].json);
          for(i = 0; i < arr.length; i++) {
            this.scope.project.activeLayer.children[arr[i]].opacity = 0;
          }
        } else {
          const p = new paper.Path();
          p.importJSON(history[drawing].json);
        }
      }
      this.layers.get(this.$store.state.auth.user.username).activate();
    });

    socket.on('hideHistory', (history) => {
      let user;
      for(user in history){
        if(this.layers.has(user)) {
          this.layers.get(user).opacity = 0;
        }
      }
    });

    socket.emit('connected', this.roomId, this.$store.state.auth.user.username);

    socket.on('draw', (data) => {
      if(!this.layers.has(data.user)) {
        this.layers.set(data.user, new paper.Layer());
        //this.scope.project.addLayer(this.layers.get(data.user));
        this.layers.get(this.$store.state.auth.user.username).remove();
        this.scope.project.layers.push(this.layers.get(this.$store.state.auth.user.username));
      }
      this.layers.get(data.user).activate();
      console.log("Got a drawing from server");
      const p = new paper.Path();
      p.importJSON(data.json);
      this.layers.get(this.$store.state.auth.user.username).activate();
    });

    socket.on('undo', (user) => {
      if(this.layers.get(user).hasChildren()) {
        this.layers.get(user).lastChild.remove();
      }
    });

    socket.on("erase", (data) => {
      this.layers.get(data.user).activate();
      let i, line;
      let arr = JSON.parse(data.json);
      for(i = 0; i < arr.length; i++) {
        this.scope.project.activeLayer.children[arr[i]].opacity = 0;
      }
    });

    socket.on('undo erase', (data) => {
      this.layers.get(data.user).activate();
      let i, line;
      let arr = JSON.parse(data.json);
      for(i = 0; i < arr.length; i++) {
        this.scope.project.activeLayer.children[arr[i]].opacity = 1;
      }
    });

    socket.on('hideUser', (user) => {
      if(this.layers.has(user)) {
        this.layers.get(user).opacity = 0;
      }
    });

    socket.on('showUser', (user) => {
      if(this.layers.has(user)) {
        this.layers.get(user).opacity = 1;
      }
    });
  }

  mounted() {
    this.scope = new paper.PaperScope();
    this.scope.setup("myCanvas");
    this.layers.set(this.$store.state.auth.user.username, new paper.Layer());
    this.scope.project.addLayer(this.layers.get(this.$store.state.auth.user.username));

    this.pen = new paper.Tool();

    this.pen.onMouseDown = (event: paper.ToolEvent) => {
      this.layers.get(this.$store.state.auth.user.username).activate();
      this.path = new paper.Path();
      this.path.strokeColor = this.color;
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
    this.square.onMouseDown = (event: paper.ToolEvent) => {
      this.layers.get(this.$store.state.auth.user.username).activate();
      this.path = new paper.Path.Rectangle(event.point, new paper.Size(1, 1));
      this.setPath(this.path);
      startPoint = event.point;
    };

    this.square.onMouseDrag = (event: paper.ToolEvent) => {
      let x = Math.abs((event.point.x - startPoint.x) / this.path.bounds.width);
      let y = Math.abs(
        (event.point.y - startPoint.y) / this.path.bounds.height
      );
      if (
        (event.point.x < startPoint.x &&
          this.path.bounds.center.x > startPoint.x) ||
        (event.point.x > startPoint.x &&
          this.path.bounds.center.x < startPoint.x)
      ) {
        x = -x;
      }
      if (
        (event.point.y < startPoint.y &&
          this.path.bounds.center.y > startPoint.y) ||
        (event.point.y > startPoint.y &&
          this.path.bounds.center.y < startPoint.y)
      ) {
        y = -y;
      }
      if (x != 0 && y != 0) {
        this.path.scale(x, y, startPoint);
      }
    };

    this.square.onMouseUp = this.send;

    this.circle = new paper.Tool();
    this.circle.minDistance = 2;
    this.circle.onMouseDown = (event: paper.ToolEvent) => {
      this.layers.get(this.$store.state.auth.user.username).activate();
      this.path = new paper.Path.Ellipse(
        new paper.Rectangle(event.point, new paper.Size(1, 1))
      );
      this.setPath(this.path);
      startPoint = event.point;
    };

    this.circle.onMouseDrag = (event: paper.ToolEvent) => {
      let x = Math.abs((event.point.x - startPoint.x) / this.path.bounds.width);
      let y = Math.abs(
        (event.point.y - startPoint.y) / this.path.bounds.height
      );
      if (
        (event.point.x < startPoint.x &&
          this.path.bounds.center.x > startPoint.x) ||
        (event.point.x > startPoint.x &&
          this.path.bounds.center.x < startPoint.x)
      ) {
        x = -x;
      }
      if (
        (event.point.y < startPoint.y &&
          this.path.bounds.center.y > startPoint.y) ||
        (event.point.y > startPoint.y &&
          this.path.bounds.center.y < startPoint.y)
      ) {
        y = -y;
      }
      if (x != 0 && y != 0) {
        this.path.scale(x, y, startPoint);
      }
    };

    this.circle.onMouseUp = this.send;

    this.move = new paper.Tool();
    this.move.onMouseDown = (event: paper.ToolEvent) =>
      (this.captureMove = false);
    this.move.onMouseDown = (event: paper.ToolEvent) => {
      this.captureMove = true;
      this.mouse.last = undefined;
    };
    this.move.onMouseDrag = (event: paper.ToolEvent) => {
      let dx, dy;
      if (this.mouse.last && this.mouse.event) {
        dx = this.mouse.last.x - this.mouse.event.clientX;
        dy = this.mouse.last.y - this.mouse.event.clientY;
      } else {
        dx = -event.delta.x;
        dy = -event.delta.y;
      }

      this.mouse.last = this.mouse.event
        ? new paper.Point(this.mouse.event.clientX, this.mouse.event.clientY)
        : undefined;
      if (dx !== 0 || dy !== 0)
        this.scope.view.center = this.scope.view.center.add(
          new paper.Point(dx, dy)
        );
    };


    this.eraser = new paper.Tool();
    this.eraser.onMouseDown = (event: paper.ToolEvent) => {
      this.layers.get(this.$store.state.auth.user.username).activate();
      this.path = new paper.Path();
      this.path.strokeColor = this.color;
      this.setPath(this.path);
      this.path.add(event.point);
    };

    this.eraser.onMouseDrag = (event: paper.ToolEvent) => {
      this.path.add(event.point);
    };

    this.eraser.onMouseUp = (event: paper.ToolEvent) => {
      this.layers.get(this.$store.state.auth.user.username).activate();
      let i, line;
      let arr = [];
      for(i = 0; i < this.scope.project.activeLayer.children.length; i++) {
        line = this.scope.project.activeLayer.children[i];
        if(line.className == 'Path' && this.path.getIntersections(line).length != 0) {
          arr.push(i);
          line.opacity = 0;
        }
      }
      const payload = {
        json: JSON.stringify(arr), 
        roomid: this.roomId,
        user: this.$store.state.auth.user.username,
        erase: true
      };
      socket.emit("erase", payload);
      this.path.remove();
    };
  }

  updateColor(eventData: ColorPicker.colors) {
    this.color = new paper.Color(
      eventData.colors.rgb.r,
      eventData.colors.rgb.g,
      eventData.colors.rgb.b,
      eventData.colors.rgb.a
    );
  }

  //run this at every onMouseUp to send this to the server
  send() {
    const json = this.path.exportJSON([true, 5]); //number is float precision
    const payload = {
      json: json, 
      roomid: this.roomId,
      user: this.$store.state.auth.user.username,
      erase: false
    };
    socket.emit("draw", payload);
  }

  undo() {
    socket.emit("undo", this.roomId, this.$store.state.auth.user.username);
  }

  setPath(path: paper.Path) {
    path.strokeColor = this.color;
    path.strokeWidth = this.width;
    path.strokeCap = "round";
    if (this.fill) path.fillColor = this.color;
  }

  activate(tool: paper.Tool, toolName: string, $e: MenuItem) {
    if (tool) tool.activate();
    this.seletedCursor  = this.cursors[toolName];
    this.selected = $e;
  }

  active($e: MenuItem) {
    return !!(this.selected && this.selected == $e);
  }

  mouseMove($event: MouseEvent) {
    if (this.captureMove) this.mouse.event = $event;
  }
}
</script>
<style lang="scss">
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

.color-picker {
  width: 300px;
  top: 50vh;
  left: 4rem;
}

.color-picker-group {
  border: $border-style;
  .vacp-color-picker {
    background-color: transparent;
    .vacp-color-space {
      border-radius: 0.75rem;
    }
  }
}

.cross-cursor {
  cursor: crosshair;
}

.pencil-cursor {
  cursor: url('../assets/iconmonstr-pencil-4.svg') 0 24, pointer;
}

.eraser-cursor {
  cursor: url('../assets/eraser.svg') 0 24, pointer;
}

.grab-cursor {
  cursor: grab;
}

.grabbing-cursor {
  cursor: grabbing;
}
</style>
