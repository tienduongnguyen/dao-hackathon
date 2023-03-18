import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  EmitterSubscription,
  Keyboard,
  Platform,
} from 'react-native';

import isEqual from 'react-fast-compare';
import { useTranslation } from 'react-i18next';
import { useSelector as useReduxSelector } from 'react-redux';

import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { ValidateMessageObject } from '@src/config/type';
import { RootState } from '@src/redux/store';

import { onCheckType } from '../method';

function useAsyncState<T>(
  initialValue: T,
): [
  T,
  (newValue: SetStateAction<T>, callback?: (newState: T) => void) => void,
] {
  const [state, setState] = useState(initialValue);
  const _callback = useRef<(newState: T) => void>();

  const _setState = (
    newValue: SetStateAction<T>,
    callback?: (newState: T) => void,
  ) => {
    if (callback) {
      _callback.current = callback;
    }
    setState(newValue);
  };

  useEffect(() => {
    if (typeof _callback.current === 'function') {
      _callback.current(state);
      _callback.current = undefined;
    }
  }, [state]);
  return [state, _setState];
}

function useMounted(callback: () => void, deps: any[] = []) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}

function useDismissKeyboard(isHide: boolean) {
  useEffect(() => {
    if (isHide) {
      Keyboard.dismiss();
    }
  }, [isHide]);
}
function useSelector<T>(
  selector: (state: RootState) => T,
  equalityFn = isEqual,
): T {
  return useReduxSelector<RootState, T>(selector, equalityFn);
}

function useDisableBackHandler(disabled: boolean, callback?: () => void) {
  // function
  const onBackPress = useCallback(() => {
    if (onCheckType(callback, 'function')) {
      callback();
    }
    return true;
  }, [callback]);
  useEffect(() => {
    if (disabled) {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [disabled, onBackPress]);
}

function useDidMount(callback: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(callback, []);
}
function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);

  React.useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);
    const handleKeyboardHide = () => setIsKeyboardShown(false);
    let keyboardWillShow: EmitterSubscription;
    let keyboardWillHide: EmitterSubscription;
    let keyboardDidShow: EmitterSubscription;
    let keyboardDidHide: EmitterSubscription;
    if (Platform.OS === 'ios') {
      keyboardWillShow = Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardShow,
      );
      keyboardWillHide = Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardHide,
      );
    } else {
      keyboardDidShow = Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardShow,
      );
      keyboardDidHide = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardHide,
      );
    }

    return () => {
      if (Platform.OS === 'ios') {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      } else {
        keyboardDidShow.remove();
        keyboardDidHide.remove();
      }
    };
  }, []);

  return isKeyboardShown;
}

function useMessageYupTranslation(msg?: string) {
  const [t] = useTranslation();

  const parsed = useMemo<ValidateMessageObject | undefined>(() => {
    if (!msg) {
      return undefined;
    }
    try {
      return JSON.parse(msg);
    } catch {
      return undefined;
    }
  }, [msg]);

  return useMemo<string | undefined>(() => {
    if (!parsed && typeof msg === 'string') {
      return t(msg);
    }
    if (!parsed) {
      return undefined;
    }

    const optionsTx: Record<string, string> = {};
    if (parsed.optionsTx) {
      Object.keys(parsed.optionsTx).forEach(key => {
        optionsTx[key] = t(parsed.optionsTx[key]);
      });
    }
    return t(parsed.keyT, { ...(parsed.options ?? {}), ...optionsTx });
  }, [parsed, t, msg]);
}

export const useTimeout = (callback: any, delay: number) => {
  const callbackRef = useRef(callback);
  // eslint-disable-next-line no-undef
  const timeoutRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
};

export default function useDebounce(
  callback: any,
  delay: number,
  dependencies: any[],
) {
  const { reset, clear } = useTimeout(callback, delay);
  useEffect(reset, [...dependencies, reset]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(clear, []);
}

type NetInfoTuple = [boolean, boolean];
function useNetWorkStatus(): NetInfoTuple {
  const [status, setStatus] = useState<boolean>(true);
  const [canAccess, setCanAccess] = useState<boolean>(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus(state.isConnected ?? false);
      setCanAccess(state.isInternetReachable ?? false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return [status, canAccess];
}

export const usePrevious = <T>(value: T): T | undefined => {
  const currentRef = useRef<T>();
  const previousRef = useRef<T>();

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
};

export {
  useAsyncState,
  useMounted,
  useDismissKeyboard,
  useDisableBackHandler,
  useDidMount,
  useIsKeyboardShown,
  useMessageYupTranslation,
  useSelector,
  useNetWorkStatus,
};
