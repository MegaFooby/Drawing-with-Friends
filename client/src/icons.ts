import { library } from '@fortawesome/fontawesome-svg-core';
import { dom } from '@fortawesome/fontawesome-svg-core'

// import {
//   faCircle,
//   faSquare,
// } from '@fortawesome/free-regular-svg-icons';

import {
  faQuestionCircle,
  faPencilRuler,
  faArrowsAlt,
  faGripLines,
  faFillDrip,
  faSyncAlt,
  faSquare,
  faCircle,
  faPen,
  faTimesCircle,
  faPalette,
  faPaperPlane,
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faComments,
  faGripLinesVertical,
  faUndoAlt,
  faThLarge,
  faCog,
  faCheck,
  faTimes,
  faEye,
  faEyeSlash,
  faEraser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

export default function () {
  dom.watch();
  library.add(
    faQuestionCircle,
    faPencilRuler,
    faArrowsAlt,
    faGripLines,
    faFillDrip,
    faSyncAlt,
    faSquare,
    faCircle,
    faPen,
    faTimesCircle,
    faPalette,
    faPaperPlane,
    faArrowUp,
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faComments,
    faGripLinesVertical,
    faUndoAlt,
    faThLarge,
    faCog,
    faCheck,
    faTimes,
    faEye,
    faEyeSlash,
    faEraser,
    faUsers,
  );
}