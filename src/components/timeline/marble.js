import { svg } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { Observable } from 'rxjs';
import { merge, values, range } from 'ramda';

import { dropshadow } from '../../styles/utils';
import {
  COLORS,
  fontBase,
  userSelectNone,
  merge as mergeStyles
} from '../../styles';

import { MARBLE_SIZE, STROKE_WIDTH } from './timeline-constants';
import { timelineItem } from './timeline-item';


const ELEMENT_CLASS = 'marble';

const POSSIBLE_COLORS = [COLORS.blue, COLORS.green, COLORS.yellow, COLORS.red];

function view(sources, value$, isHighlighted$) {
  return Observable.combineLatest(
    sources.id, sources.content, sources.color, sources.size, value$, isHighlighted$)
    .map(([id, content, color, size, value, isHighlighted]) =>
      svg.g({
        attrs: { class: ELEMENT_CLASS, transform: `translate(${value}, 2)` },
        style: { cursor: isHighlighted ? 'ew-resize' : 'default'  },
      }, [
        svg.circle({
          attrs: { r: size, transform: "translate(0, 3)" },
          style: merge({
            fill: color,
            stroke: 'black',
            strokeWidth: STROKE_WIDTH,
          }, isHighlighted ? dropshadow : {}),
        }),
        content ? svg.text({
          attrs: {
            'text-anchor': 'middle', y: '0.8' },
          style: mergeStyles({ fontSize: '2.5px' }, fontBase, userSelectNone),
        }, [`${JSON.stringify(content)}`]) : undefined,
      ]),
    );
}

function OriginalMarble(sources) {
  const { DOM, time } = timelineItem(ELEMENT_CLASS, view, sources);

  const data$ = Observable.combineLatest(time, sources.id)
    .map(([time, id]) => ({ time, id }));

  return { DOM, data: data$ };
}

export function Marble(sources) {
  return isolate(OriginalMarble)(sources);
}
