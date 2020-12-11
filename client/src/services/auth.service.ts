import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from './socket-io.service';

class AuthService {
  login(user:any) {
    console.log(API_URL + 'users/authenticate')
    return axios
      .post(API_URL + 'users/authenticate', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  current(user:any) {
    return axios
      .get(API_URL + 'users/current', {headers: authHeader()})
      .then(response => {
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user:any) {
    return axios.post(API_URL + 'users/register', {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      password: user.password
    });
  }
}

export default new AuthService();