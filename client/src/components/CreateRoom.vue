<template>
  <div>
    <v-overlay
      z-index="5"
    >
      <v-card
        class="rounded-xl menu-card"
        :light="true"
      >
        <v-card-title
          class="justify-center text-h5"
        >
          Create a room
        </v-card-title>
        
        <v-card-text>
          <v-text-field
            label="Room Name"
            v-model="name"
            :rules="[rules.required]"
          ></v-text-field>

          <v-checkbox
            v-model="isPrivate"
            label="Private"
            color="black"
          ></v-checkbox>
          <v-text-field
            label="Users"
            v-model="users"
            hint="A list of usernames seperated by commas"
            persistent-hint
          ></v-text-field>
        </v-card-text>
        <v-card-actions
          class="justify-space-around"
        >
          <v-btn
            rounded
            @click="cancel"
            class="menu-button"
          >Cancel</v-btn>
          <v-btn
            rounded
            @click="createRoom"
            class="menu-button"
          >Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RoomService from "../services/room.service";

@Component
export default class CreateRoom extends Vue {
  private name = "";
  private isPrivate = true;
  private users = "";

  private rules = {
    required: value => !!value || 'Required.'
  } 

  createRoom(){
    if (this.name !== "") {
      const userArr = this.users.split(",");
      userArr.forEach((item) =>{
        item.trim();
      });
      const username = this.$store.state.auth.user.username;
      console.log(username);
      RoomService.create(this.name, this.isPrivate, userArr, username).then(
        response => {
          this.$router.push({ path: "/room/" + response.id});
        },
        error => {
            const message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
            console.log(message);
          }
      )
    }
  }

  cancel() {
    this.$router.push({ name: "Rooms"});
  }
}

</script>

<style lang="scss">
  .menu-card {
    border: $card-border-style;
  }
  .theme--light.v-sheet {
    border-color: unset;
  }
  .menu-button{
    border: $border-style;
  }
</style>