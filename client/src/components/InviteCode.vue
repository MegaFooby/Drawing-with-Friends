<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
    <v-card 
      v-if="dialog"
      class="rounded-xl menu-card"
    >
        <v-card-title class="headline">
          Invite
        </v-card-title>
        <v-card-text>
        <v-text-field
          ref="inviteCode"
          label="Invite Code"
          :value="roomId"
          outlined
          readonly
          append-icon="mdi-content-copy"
          @click:append="copy"
        ></v-text-field>
        <v-text-field
            label="Invite user by username"
            v-model="username"
            append-icon="mdi-account-plus"
            @click:append="joinRoom"
            @keydown.enter="joinRoom"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            rounded
            @click="closeDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-snackbar
        v-model="snackbar"
      >{{ snackbarMessage }}
      </v-snackbar>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Room } from "../models/room";
import RoomService from "../services/room.service"

@Component
export default class InviteCode extends Vue {
  @Prop() roomId!: string;
  @Prop({required: true}) dialog: boolean;

  private username = "";
  private snackbar = false;
  private snackbarMessage = "";

  closeDialog() {
    this.$emit("close");
  }

  copy() {
    const textToCopy = (this.$refs.inviteCode as Vue).$el.querySelector('input');
    textToCopy.select();
    document.execCommand("copy");
    this.snackbarMessage = "Copied!";
    this.snackbar = true;
  }

  joinRoom() {
    RoomService.join(this.roomId, this.username).then(
      res => {
        this.snackbarMessage = "Added!";
        this.username = "";
        this.snackbar = true;
      },
      error => {
        this.snackbarMessage = "Invalid Username";
        this.snackbar = true;
      }
    );
  }
}
</script>
<style lang="scss">
.menu-card {
  border: $card-border-style;
}
.v-dialog {
  border-radius: 24px;
}
</style>