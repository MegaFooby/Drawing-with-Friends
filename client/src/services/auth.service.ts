import axios from 'axios';

const API_URL = 'http://localhost:4000/';

class AuthService {
  login(user:any) {
    return axios
      .post(API_URL + 'users/authenticate', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        console.log(response);
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

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