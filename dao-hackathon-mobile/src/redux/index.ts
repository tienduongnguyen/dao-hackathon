import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';

import { State } from '.';
export function useReducer<T>(
  selector: (state: State) => T,
  equalityFn = isEqual,
): T {
  const state = useSelector<State, State>(x => x, equalityFn);
  return selector(state);
}

export * from './actions';
export * from './models/store';
