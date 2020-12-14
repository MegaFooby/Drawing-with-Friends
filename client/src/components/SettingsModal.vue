<script>
  import Component from 'vue-class-component';
  import MenuItem from "./menu/MenuItem.vue";
//import User from "../models/user";
export default {
  name: "modal",
  data() {
    return {
      newUN: "",
      newPW: ""
    };
  },
  components: {
    MenuItem
  },
  methods: {
    close() {
      this.$emit("close");
    },
    processForm() {
      console.log({ newUN: this.newUN, newPW: this.newPW });
    },

    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },

    getUser() {
      return this.$store.state.auth.user;
    }
  }
};
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
            <slot name="header"><b>Settings</b></slot>
          </header>
          <section class="modal-body" id="modalDescription">
            <slot name="body">
              <label for="newUN">Change Username:</label><br />
              <input
                type="text"
                class="input"
                v-model="newUN"
                name="newUN"
              /><br />
              <label for="newPW">Change Password:</label><br />
              <input
                type="text"
                class="input"
                v-model="newPW"
                name="newPW"
              /><br /><!--
              <label for="newColor">Change Colour (Hex):</label><br />
              <input
                type="text"
                id="newColor"
                name="newColor"
                value=""
              /><br /><br />-->
            </slot>
          </section>
          <footer class="modal-footer">
            <slot name="footer">
              <menu-item title="Cancel" @click="close()" icon="times"/>
              <menu-item title="Accept Changes" @click="processForm()" icon="check"/>
            </slot>
          </footer>
        </div>
      </div>
    </transition>
  </form>
</template>
<style scoped  lang="scss">
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
