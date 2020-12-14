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
          Delete Room
        </v-card-title>
        <v-card-text>Are you sure you want to delete {{ room.name }}?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="deleteRoom"
          >
            Confirm
          </v-btn>
          <v-btn
            text
            rounded
            @click="closeDialog"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Room } from "../models/room";

@Component
export default class DeletePrompt extends Vue {
  @Prop() room!: Room;
  @Prop({required: true}) dialog: boolean;

  deleteRoom() {
    this.$store.dispatch("room/delete", this.room).then(
      response => {
        this.closeDialog();
      },
      error => {
        console.log(error);
      }
    )
  }

  closeDialog() {
    this.$emit("close");
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