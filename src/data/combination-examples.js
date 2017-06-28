import { Observable } from 'rxjs';

import {
  COLORS,
} from '../styles';

/* t = time, c = content */
export const combinationExamples = {
  merge: {
    label: 'merge',
    inputs: [
      {name: "ticks", defaultColor: COLORS.yellow, defaultSize: 0.5, data: [{t:0, color: COLORS.blue, size: 2}, {t:2}, {t:30, c:60}, {t:45, c:80}, {t:60, c:100}]},
      {name: "bbb", data: [{t:37, c:{a:"bb"}}, {t:68, c:1}]}
    ],
    apply: function(inputs) {
      return Observable.merge(...inputs);
    },
    outputs: [
      {name: "out", data:[{t: 0, c: 3321}, {t: 90, c: undefined}]},
      {name: "out2", data:[{t: 0, c: 3321, color: "grey"}, {t: 90, c: undefined}]}
    ],
  },
}