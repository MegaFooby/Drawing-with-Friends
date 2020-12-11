import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:4000/';

class RoomService {
  getall(user:any) {
    return axios
      .post(API_URL + 'rooms/', {
        user: user.username
      }, {headers: authHeader()})
      .then(response => {
        return response.data;
      });
  }
}

export default new RoomService();