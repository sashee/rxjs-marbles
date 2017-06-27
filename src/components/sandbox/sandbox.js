import { div } from '@cycle/dom';
import { Observable } from 'rxjs';
import { apply, flip, identity, length, map, merge, prop, zip } from 'ramda';

import { Collection } from '../../collection';
import { examples } from '../../data';
import { bgWhite } from '../../styles';
import { merge as mergeStyles, elevation1 } from '../../styles/utils';

import { Timeline } from '../timeline';

import { createOutputStream$ } from './sandbox-output';
import { inputsToTimelines } from './sandbox-input';
import { renderOperatorBox } from './operator-label';;


const sandboxStyle = mergeStyles(bgWhite, elevation1, { borderRadius: '2px' });

export function Sandbox({ DOM, store }) {
  const example$ = store.pluck('route')
    .skip(1) // blank first route
    .distinctUntilChanged()
    .map(exampleKey => examples[exampleKey])
    .publishReplay(1).refCount();

  const inputStores$ = example$
    .switchMap(example =>
      store.pluck('inputs')
        .filter(identity)
        // bug: For some reason inputDataList$ emits old value after
        // route change. Skip it.
        .skip(1)
        .startWith(inputsToTimelines(example.inputs))
    )
    .publishReplay(1).refCount();
  const oStores$ = example$
    .switchMap(example =>
      store.pluck('outputs')
        .filter(identity)
        // bug: For some reason inputDataList$ emits old value after
        // route change. Skip it.
        .skip(1)
        .startWith(inputsToTimelines(example.outputs))
    )
    .publishReplay(1).refCount();

  const inputTimelines$
    = Collection.gather(Timeline, { DOM }, inputStores$, 'id')
      .publishReplay(1).refCount()
  const oTimelines$
    = Collection.gather(Timeline, { DOM }, oStores$, 'id')
      .publishReplay(1).refCount()

  const inputDOMs$ = Collection.pluck(inputTimelines$, prop('DOM'));
  const inputDataList$ = Collection.pluck(inputTimelines$, prop('data'))
    .filter(length)
    .debounceTime(0)
    .withLatestFrom(inputStores$, zip)
    .map(map(apply(flip(merge))));
  const oDOMs$ = Collection.pluck(oTimelines$, prop('DOM'));

  const vtree$ = Observable
    .combineLatest(inputDOMs$, oDOMs$, example$)
    .map(([inputsDOMs, oDOMs, example]) =>
      div({ style: sandboxStyle }, [
        ...inputsDOMs,
        renderOperatorBox(example.label),
		...oDOMs
      ]),
    );

  return {
    DOM: vtree$,
    data: inputDataList$.map((inputs) => ({ inputs })),
  };
}
