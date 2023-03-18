import React, { createRef, forwardRef, useImperativeHandle } from 'react';

import { useDispatch } from 'react-redux';

import { RootState } from '@src/redux/store';
import { Colors, useTheme } from '@src/themes';

import { useSelector } from '../hooks';

export type ActionBase<T = any> = {
  type: string;
  payload?: T;
};

const RXStoreComponent = forwardRef((props, ref) => {
  const rnDispatch = useDispatch();
  const { colors } = useTheme();
  const store = useSelector(x => x);

  // effect
  useImperativeHandle(
    ref,
    () => ({
      dispatch: (action: ActionBase) => {
        rnDispatch(action);
      },
      getState: (state: keyof RootState) => {
        return store[state];
      },
      getColorTheme: (colorKey: keyof Colors) => {
        return colors[colorKey];
      },
    }),
    [colors, rnDispatch, store],
  );
  return null;
});

type RXStoreType = {
  dispatch: (action: ActionBase) => void;
  getState: <K extends keyof RootState>(selector: K) => RootState[K];
  getColorTheme: (colorKey: keyof Colors) => string;
};

const storeRef = createRef<RXStoreType>();

export const RXStore = () => <RXStoreComponent ref={storeRef} />;

export const dispatch = (action: ActionBase) => {
  if (storeRef.current) {
    storeRef.current.dispatch(action);
  }
};
export function getState<K extends keyof RootState>(selector: K): RootState[K] {
  if (storeRef.current) {
    return storeRef.current.getState(selector);
  }
  return {} as RootState[K];
}
export function getColorTheme(colorKey: keyof Colors): string | undefined {
  if (storeRef.current) {
    return storeRef.current.getColorTheme(colorKey);
  }
  return undefined;
}
