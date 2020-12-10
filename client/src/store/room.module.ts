import RoomService from '../services/room.service';

const initialState = {rooms: []}
export const room = {
  namespaced: true,
  state: initialState,
  actions: {
    getall({ commit }:any, user:any) {
      return RoomService.getall(user).then(
        rooms => {
          commit('roomsSuccess', user);
          return Promise.resolve(rooms);
        },
        error => {
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    roomsSuccess(state:any, rooms:any) {
      state.rooms = rooms;
    }
  }
};