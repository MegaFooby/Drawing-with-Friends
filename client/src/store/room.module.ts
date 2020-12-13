import RoomService from '../services/room.service';
import { Room } from '../models/room';

const initialState = {rooms: []}
export const room = {
  namespaced: true,
  state: initialState,
  actions: {
    getall({ commit }:any, user:any) {
      return RoomService.getall(user).then(
        rooms => {
          commit('roomsSuccess', rooms);
          return Promise.resolve(rooms);
        },
        error => {
          return Promise.reject(error);
        }
      );
    },
    delete({ commit }:any, room:Room) {
      return RoomService.delete(room).then(
        res => {
          commit('removeRoom', room);
          return Promise.resolve(res);
        },
        error => {
          return Promise.reject(error);
        }
      )
    }
  },
  mutations: {
    roomsSuccess(state:any, rooms:any) {
      state.rooms = rooms;
    },
    removeRoom(state:any, room: Room) {
      console.log(state.rooms);
      state.rooms = state.rooms.filter((sRoom: any) => sRoom.id != room.id);
    }
  }
};