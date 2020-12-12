<template>
  <div class="col-md-12">
    <v-img src="../assets/logo.png" contain max-height="125" ref="logo"></v-img>
    <div class="card card-container rounded-xl">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form name="form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model="user.username"
            v-validate="'required'"
            type="text"
            class="form-control input-border rounded-xl"
            name="username"
          />
          <div
            v-if="errors.has('username')"
            class="red--text alert alert-danger"
            role="alert"
          >Username is required!</div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="user.password"
            v-validate="'required'"
            type="password"
            class="form-control input-border rounded-xl"
            name="password"
          />
          <div
            v-if="errors.has('password')"
            class="red--text alert alert-danger"
            role="alert"
          >Password is required!</div>
        </div>
        <div class="form-group pt-3">
          <v-btn 
            @click="handleLogin"
            rounded
            :loading="loading"
            class="input-border"
          >Login</v-btn>
        </div>
        <div class="form-group">
          <div v-if="message" class="alert alert-danger red--text pt-3" role="alert">{{message.message}}</div>
        </div>
      </form>
      <v-btn 
        v-on:click="register"
        rounded
        class="input-border mt-3"
      >Create Account</v-btn>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Login',
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/rooms');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/rooms');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        }
      });
    },
    register() {
      this.$router.push('/register');
    }
  }
};
</script>

<style lang="scss" scoped>
label {
  display: block;
  margin-top: 10px;
}

.card-container.card {
  max-width: 350px !important;
  padding: 40px 40px;
}

.card {
  background-color: #FFFFFF;
  border: $card-border-style;
  padding: 20px 25px 30px;
  margin: 0 auto 25px;
  margin-top: 50px;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}

.profile-img-card {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}

.input-border {
  border: $border-style;
}
.input-border:focus {
  outline: none
}
</style>