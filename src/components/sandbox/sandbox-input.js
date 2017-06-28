import { last } from 'ramda';

import { calculateNotificationHash } from './sandbox-utils';

function inputToMarbles(stream) {
  return stream.data.map(({ t: time, c: content, color, size}, index) => ({
    id: calculateNotificationHash({ time, content }),
    time,
    content,
    itemId: index,
	name: stream.name,
	color: color || stream.defaultColor,
	size: size || stream.defaultSize || 1
  }));
}

function getInput(input) {
  const lastInput = last(input);
  return typeof lastInput === 'number'
    ? input.slice(0, -1)
    : input;
}

function getTime(input) {
  const lastInput = last(input);
  return typeof lastInput === 'number'
    ? lastInput
    : 100;
}

export function inputsToTimelines(inputs) {
  return inputs
    .map((input, index) => ({
      id: index,
      marbles: inputToMarbles(getInput(input)),
      end: { time: getTime(input) },
      interactive: true,
	  name: input.name,
	  defaultColor: input.defaultColor
    }));
}
