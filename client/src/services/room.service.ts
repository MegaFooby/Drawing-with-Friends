import axios from 'axios';
import authHeader from './auth-header';
import { API_URL } from './socket-io.service';
import { Room } from '../models/room';

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
  create(name: string, isPrivate: boolean, users: string[], username: string) {
    users.push(username);
    return axios
      .post(API_URL + 'rooms/create', {
        name: name,
        isPrivate: isPrivate,
        users:users,
        creatorUsername: username
      }, {headers: authHeader()})
      .then(response => {
        return response.data
      });
  }
  delete(room: Room) {
    return axios
      .delete(API_URL + 'rooms/' + room.id, {headers: authHeader()})
      .then(response => {
        return response.data
      });
  }
}

export default new RoomService();