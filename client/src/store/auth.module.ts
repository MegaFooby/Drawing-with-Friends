import AuthService from '../services/auth.service';

const userCookie = localStorage.getItem('user');

const user = typeof userCookie === 'string' ? JSON.parse(userCookie) : null;
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    current({ commit }:any, user:any) {
      console.log("Test2")
      console.log(user);
      return AuthService.current(user)//.then(
      //   user => {
      //     commit('loginSuccess', user);
      //     return Promise.resolve(user);
      //   },
      //   error => {
      //     commit('loginFailure');
      //     return Promise.reject(error);
      //   }
      // );
    },
    login({ commit }:any, user:any) {
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }:any) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }:any, user:any) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state:any, user:any) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state:any) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state:any) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state:any) {
      state.status.loggedIn = false;
    },
    registerFailure(state:any) {
      state.status.loggedIn = false;
    }
  }
};