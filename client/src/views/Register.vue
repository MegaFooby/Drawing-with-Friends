<template>
  <div class="col-md-12">
    <v-img src="../assets/logo.png" contain max-height="125" ref="logo"></v-img>
    <div class="card card-container rounded-xl">
      <img
        id="profile-img"
        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
        class="profile-img-card"
      />
      <form name="form" @submit.prevent="handleRegister">
        <div v-if="!successful">
          <div class="form-group">
            <label for="firstname">First Name</label>
            <input
              v-model="user.firstName"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="form-control input-border rounded-xl"
              name="firstname"
            />
            <div
              v-if="submitted && errors.has('firstname')"
              class="red--text alert-danger"
            >{{errors.first('firstname')}}</div>
          </div>

          <div class="form-group">
            <label for="lastname">Last Name</label>
            <input
              v-model="user.lastName"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="form-control input-border rounded-xl"
              name="lastname"
            />
            <div
              v-if="submitted && errors.has('lastname')"
              class="red--text alert-danger"
            >{{errors.first('lastname')}}</div>
          </div>
          
          <div class="form-group">
            <label for="username">Username</label>
            <input
              v-model="user.username"
              v-validate="'required|min:3|max:20'"
              type="text"
              class="form-control input-border rounded-xl"
              name="username"
            />
            <div
              v-if="submitted && errors.has('username')"
              class="red--text alert-danger"
            >{{errors.first('username')}}</div>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="user.password"
              v-validate="'required|min:6|max:40'"
              type="password"
              class="form-control input-border rounded-xl"
              name="password"
            />
            <div
              v-if="submitted && errors.has('password')"
              class="red--text alert-danger"
            >{{errors.first('password')}}</div>
          </div>
          <div class="form-group">
            <v-btn
              v-on:click="handleRegister" 
              class="input-border rounded-xl btn mt-3"
            >Sign Up</v-btn>
          </div>
        </div>
      </form>

      <div
        v-if="message"
        class="alert red--text"
        :class="successful ? 'alert-success' : 'alert-danger'"
      >{{message.message}}</div>
    </div>
  </div>
</template>

<script>
import User from '../models/user';

export default {
  name: 'Register',
  data() {
    return {
      user: new User('', '', '', ''),
      submitted: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            data => {
              this.message = data.message;
              this.successful = true;
              this.$router.push('/profile');
            },
            error => {
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
        }
      });
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