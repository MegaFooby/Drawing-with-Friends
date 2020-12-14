<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
    <template v-slot:activator="{on, attrs}">
      <v-btn 
        rounded 
        class="black--text menu-button"
        v-bind="attrs"
        v-on="on"
      >
        Have an invite code?
      </v-btn>
    </template>
    <v-card 
      class="rounded-xl menu-card"
    >
        <v-card-title class="headline">
          Join Room
        </v-card-title>
        <v-card-text>Use an invite code to join a room:
          <v-text-field
          label="Invite code"
          v-model="code"
        ></v-text-field>
        <v-alert
          v-model="error"
          dense
          type="error"
          dismissible
        >Invalid invite code</v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            @click="joinRoom"
          >
            Join
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Room } from "../models/room";

import RoomService from "../services/room.service";

@Component
export default class InviteCodePrompt extends Vue {
  private code = "";
  private dialog = false;
  private error = false;

  joinRoom() {
    RoomService.join(this.code, this.$store.state.auth.user.username).then(
      res => {
        this.$router.push({path: "/room/"+this.code});
      },
      error => {
        this.error = true;
      }
    );
  }

  closeDialog() {
    this.dialog = false;
  }
}
</script>
<style lang="scss">
.menu-card {
  border: $card-border-style;
}
</style>