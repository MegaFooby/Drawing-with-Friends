import { io } from 'socket.io-client';
import { getTime } from '../plugins/time';
import store from '../store';

const port = process.env.PORT || 3000;
export const API_URL = `http://localhost:3000/`;

export interface Message {
  msg: string;
  effect: string;
  from: string;
  name: string;
  colour: string;
  time: string;
}

interface MessagePayload {
  roomid: string;
  message: Message;
}

class SocketIOService {
  readonly socket = io(API_URL);

  sendMsg(message: any, roomid = "default"): Message {
    const payload: MessagePayload = {
      roomid,
      message: {
        name: (store.state as any).auth.user.username,
        from: (store.state as any).auth.user.id,
        time: getTime(),
        msg: message,
        colour: "black",         // TODO: colors for users
        effect: "",
      }
    }
    this.socket.emit('chat-msg', payload)
    return payload.message;
  }
}

export default new SocketIOService();
