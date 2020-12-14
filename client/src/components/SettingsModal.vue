<script lang="ts">
  import Axios from "axios";
  import { Component, Vue, Prop } from "vue-property-decorator";
  import { use } from "vue/types/umd";
  import { Room } from "../models/room";
  import MenuItem from "./menu/MenuItem.vue";
  import SocketService from '../services/socket-io.service';
import roomService from "../services/room.service";

  //import User from "../models/user";

@Component({
  name: "modal",

  components: { MenuItem },
})
export default class Modal extends Vue {
  @Prop() currentRoom!: Room;
  @Prop() isOwner!: boolean;
  inRoom = true;
  isAdmin = true;

  userList = []

  setList(list) {
    this.userList = list;
    const me = this.userList.find( u => u.username === this.$store.state.auth.user.username);
    me.username += " (me)";
    me.online = true;
    console.log(list);
  }

  mounted() {
    roomService.getUsers(this.$route.params.roomId).then(list => this.setList(list));
  }

  created() {
    SocketService.socket.on('userList', list => this.setList(list));
    SocketService.socket.on('hideUser', (id, name) => this.show(this.userList.find( u => u.username === name)));
    SocketService.socket.on('showUser', (id, name) => this.hide(this.userList.find( u => u.username === name)));
  }

  close() {
    this.$emit("close");
  }

  roomIsPrivate() {
    return true;
  }
  userIsAdmin() {
    return this.$store.state.auth.user.admin || this.isOwner;
  }
  hide(user) {
    if (!user) return;
    user.isHidden = true;
    SocketService.socket.emit('hideUser', this.$route.params.roomId, user.username)
  }
  show(user) {
    if (!user) return;
    user.isHidden = false;
    SocketService.socket.emit('showUser', this.$route.params.roomId, user.username)
  }

  loggedIn() {
    return this.$store.state.auth.status.loggedIn;
  }

  getUser() {
    return this.$store.state.auth.user;
  }
}

</script>
<template>
  <form @submit.prevent="">
    <transition name="modal-fade">
      <div class="modal-backdrop">
        <div
          class="modal"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-describedby="modalDescription"
        >
          <header class="modal-header" id="modalTitle">
            <slot name="header"><b>Users</b></slot>
            <menu-item title="Cancel" @click="close()" icon="times"/>
          </header>
          <section class="modal-body" id="modalDescription">
            <slot name="body">
              <ul v-if="currentRoom" class="user-list">
                <li v-for="user in userList" :key="user.username">
                  <span>
                    <font-awesome-icon :title="user.online ? 'Online' : 'Offline'" :class="{online: user.online, offline: !user.online}" icon="circle"></font-awesome-icon>
                    {{user.username}}
                  </span>
                  <span v-if="userIsAdmin()" class="actions">
                    <menu-item v-if="!user.isHidden" title="Hide User's Layer" @click="hide(user)" icon="eye"/>
                    <menu-item v-if="user.isHidden" title="Show User's Layer" @click="show(user)" icon="eye-slash"/>
                    <!-- <menu-item v-if="roomIsPrivate()" title="Remove User From Room" @click="removeUser(user)" icon="times"/> -->
                  </span>
                </li>
              </ul>
            </slot>
          </section>
        </div>
      </div>
    </transition>
  </form>
</template>
<style scoped  lang="scss">

.user-list {
  padding: 0;
  max-height: 45vh;
  overflow: scroll;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:not(:last-of-type) {
      border-bottom: 1px solid #cacaca;
    }
    .online {
      color: lightgreen;
    }
    .offline {
      color: lightgrey;
    }

    .actions {
      display: flex;
    }
  }
}

input[type="text"],
textarea {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(0, 0, 0);
  border-radius: 4px;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
}

.modal {
  padding: 0.5rem 1rem;
  background: $menu-bg;
  border-radius: 1.25rem;
  border: 2px solid rgb(0, 0, 0);
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 10001;
}

.modal-header,
.modal-footer {
  padding:  0;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #cacaca;
  background: $menu-bg;
  color: rgb(1, 9, 17);
  justify-content: space-between;
  align-items: center;
}

.modal-footer {
  background: $menu-bg;
  border-top: 1px solid #cacaca;
  justify-content: flex-end;
}

.modal-body {
  background: $menu-bg;
  position: relative;
  padding: 20px 10px;
}

.close-buttons {
  font-size: 1rem;
  padding: 0;
  z-index: 100000;
}

.btn-close {
  color: white;
  background: rgb(119, 174, 223);
  border: 1px solid #000000;
  border-radius: 2px;
  width: auto;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
