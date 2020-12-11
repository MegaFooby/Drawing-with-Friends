<template>
  <div class="d-flex flex-column view" ref="window">
    <v-img src="../assets/logo.png" contain max-height="125" ref="logo"></v-img>
    <v-container
      fluid
      ref="roomSelector"
      class="rooms"
      :style="{ 'max-height': roomsHeight + 'px' }"
    >
      <v-row>
        <v-col v-for="room in rooms" :key="room.id" :cols="3">
          <v-card
            class="rounded-xl"
            color="primary"
            height="200px"
            elevation="4"
            @click="openRoom(room)"
          >
            <v-card-title>
              <v-icon large left :color="room.isPrivate ? '' : 'primary'"
                >mdi-lock</v-icon
              >
            </v-card-title>
            <v-card-text v-text="room.name" class="text-h5"></v-card-text>
            <v-card-text class="text-h6">Creator: {{room.creatorUsername}}</v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="3">
          <v-card
            class="rounded-xl align-center justify-center flex-column d-flex"
            color="primary"
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
      <v-btn color="primary" rounded class="black--text">
        Have an invite code?
      </v-btn>
      <v-btn color="primary" rounded class="black--text" @click="logout"
        >Logout</v-btn
      >
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class RoomMenu extends Vue {
  private rooms: Room[] = [];

  roomsHeight = 0;

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
      this.$store.dispatch('room/getall', this.getUser()).then(
          response => {
            this.rooms = response;
          },
          error => {
            const message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
            console.log(message);
          }
      );
    }
  }

  openRoom(room: Room) {
    this.$router.push({ path: "/room/" + room.id, query:{id: room.id} });
  }

  createRoom() {
    console.log("todo");
  }

  logout() {
      this.$store.dispatch('auth/logout').then(
       () => {
              this.$router.push('/login');
            }
      )
    }
}

interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  creatorUsername: string;
}
</script>
<style lang="css" scoped>
.view {
  height: 100%;
}
.rooms {
  overflow-y: auto;
  height: 100%;
}
</style>
