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
        Admin Panel
      </v-btn>
    </template>
    <v-card 
      class="rounded-xl menu-card"
    >
        <v-card-title class="headline">
          Admin
        </v-card-title>
        <v-card-text>Make another user an admin
          <v-text-field
            label="Username"
            v-model="username"
            append-icon="mdi-account-plus"
            @click:append="addAdmin"
            @keydown.enter="addAdmin"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
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
import AuthService from "../services/auth.service";

@Component
export default class AdminPanel extends Vue {
  private dialog = false;

  private username = "";
  private snackbar = false;
  private snackbarMessage = "";

  closeDialog() {
    this.dialog = false;
  }

  addAdmin() {
    AuthService.makeAdmin(this.username).then(
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