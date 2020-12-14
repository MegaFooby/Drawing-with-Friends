<template>
  <div class="d-flex flex-column view" ref="window">
    <!--<button type="button" class="btn" @click="showModal">Settings</button>-->
    <modal v-show="isModalVisible" @close="closeModal" />
    <v-img src="../assets/logo.png" contain max-height="125" ref="logo"></v-img>
    <v-container
      fluid
      ref="roomSelector"
      class="rooms"
      :style="{ 'max-height': roomsHeight + 'px' }"
    >
      <v-row>
        <v-col v-for="room in rooms" :key="room.id" :cols="cardColumns">
          <v-card
            class="rounded-xl room-card"
            height="200px"
            elevation="4"
            @click="openRoom(room)"
          >
            <v-card-title class="justify-space-between">
              <v-icon :color="room.isPrivate ? '' : 'white'"
                >mdi-lock</v-icon
              >
              <v-icon v-if="isCreator(room) || isAdmin" @click.stop="promptDelete(room)">
                mdi-delete
              </v-icon>
            </v-card-title>
            <v-card-text v-text="room.name" class="text-h5"></v-card-text>
            <v-card-text class="text-h6">Creator: {{room.creatorUsername}}</v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="cardColumns">
          <v-card
            class="rounded-xl align-center justify-center flex-column d-flex room-card"
            height="200px"
            elevation="4"
            @click="createRoom"
          >
            <v-card-text
              v-text="'Create a new room'"
              class="text-h5"
            ></v-card-text>
            <v-icon large>mdi-plus-circle</v-icon>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div class="d-flex justify-space-between pa-3 mt-auto" ref="otherButtons">
      <invite-code-prompt/>
      <admin-panel v-if="isAdmin"/>
      <v-btn rounded class="black--text menu-button" @click="logout"
        >Logout</v-btn
      >
    </div>
    <router-view></router-view>
    <delete-prompt
      :dialog="deleteDialog"
      :room="deleteRoom"
      @close="closeDialog"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import modal from "../components/SettingsModal.vue";
import DeletePrompt from "./DeletePrompt.vue";
import InviteCodePrompt from "./InviteCodePrompt.vue";
import AdminPanel from "./AdminPanel.vue";
import { Room } from "../models/room";

@Component({
  components: {
    modal,
    DeletePrompt,
    InviteCodePrompt,
    AdminPanel
  }
})
export default class RoomMenu extends Vue {
  private deleteDialog = false;
  private deleteRoom: Room = null;

  roomsHeight = 0;

  isModalVisible = false;
  created() {
    this.getRooms();
    window.addEventListener("resize", this.updateRoomsHeight);
  }

  mounted() {
    this.updateRoomsHeight();
  }

  loggedIn() {
    return this.$store.state.auth.status.loggedIn;
  }

  getUser(){
    return this.$store.state.auth.user;
  }

  destroyed() {
    window.removeEventListener("resize", this.updateRoomsHeight);
  }

  updateRoomsHeight() {
    const logo = this.$refs.logo as Vue;
    const buttons = this.$refs.otherButtons as Element;

    this.roomsHeight =
      window.innerHeight - logo?.$el.clientHeight - buttons?.clientHeight;
  }

  getRooms() {
    //TODO get rooms from backend
    if(this.loggedIn()){
      this.$store.dispatch('room/getall', this.getUser());
    }
  }

  get rooms() {
    return this.$store.state.room.rooms;
  }

  openRoom(room: Room) {
    this.$router.push({ path: "/room/" + room.id});
  }

  createRoom() {
    this.$router.push({ path: "/rooms/create"});
  }

  logout() {
      this.$store.dispatch('auth/logout').then(
       () => {
              this.$router.push('/login');
            }
      )
  }
  showModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  isCreator(room: Room) {
    return room.creatorUsername === this.getUser().username;
  }

  get isAdmin() {
    return this.getUser().admin;
  }

  promptDelete(room: Room) {
    this.deleteRoom = room;
    this.deleteDialog = true;
  }

  closeDialog(){
    this.deleteDialog = false;
  }

  get cardColumns() {
    return this.$vuetify.breakpoint.mobile?12:3;
  }
}
</script>
<style lang="scss" scoped>
.view {
  height: 100%;
}
.rooms {
  overflow-y: auto;
  height: 100%;
}
  .room-card {
    border: $card-border-style;
  }
  .menu-button{
    border: $border-style;
  }
  .theme--light.v-sheet {
    border-color: unset;
  }
.btn {
  position: absolute;
  z-index: 10000;
  top: 0;
  left: 0;
}

button {
  padding: unset;
}
</style>
