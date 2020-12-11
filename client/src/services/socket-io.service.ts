import { io } from 'socket.io-client';
import { getTime } from '../plugins/time';
import store from '../store';

const port = process.env.PORT || 3000;
export const API_URL = `http://localhost:3000/`;

class SocketIOService {
  readonly socket = io(API_URL);

  sendMsg(roomid: string, message: any){
    console.log(`Sending message: ${message}`);
    const payload = {
      roomid,
      msg: {
        name: store.state.auth.user.username,
        from: store.state.auth.user.id,
        time: getTime(),
        msg: message,
        colour: "black",         // TODO: colors for users
        effect: "",
      }
    }
    this.socket.emit('chat-msg', payload)
  }
}

export default new SocketIOService();
