import { colors } from "vuetify/lib";

declare module 'v-drag';
declare module 'vue-accessible-color-picker' {
  ColorPicker: {
    colors
  }
};