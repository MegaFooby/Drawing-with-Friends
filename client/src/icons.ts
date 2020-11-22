import { library } from '@fortawesome/fontawesome-svg-core';
import { dom } from '@fortawesome/fontawesome-svg-core'

// import {
//   faCircle,
//   faSquare,
// } from '@fortawesome/free-regular-svg-icons';

import {
  faPen,
  faSquare,
  faCircle,
  faFillDrip,
  faGripLines,
  faPencilRuler,
  faQuestionCircle,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';

export default function () {
  dom.watch();
  library.add(
    faQuestionCircle,
    faPencilRuler,
    faGripLines,
    faFillDrip,
    faSyncAlt,
    faSquare,
    faCircle,
    faPen,
  );
}