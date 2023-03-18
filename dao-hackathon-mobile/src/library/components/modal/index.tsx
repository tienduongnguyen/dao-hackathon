import React, { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

import { useDismissKeyboard } from '@hooks';
import { useReducer } from '@src/redux';

import { ModalContent } from './modal-content';
import { ModalProps } from './type';

import { Portal } from '../portal';

export const Modal = (props: ModalProps) => {
  // state
  const [visible, setVisible] = useState<boolean>(props.isVisible);
  const modalContent = useRef<ModalContent>(null);
  const appExpired = useReducer(x => x.App.appExpired);

  // function
  const closeModal = () => {
    setVisible(false);
  };

  // effect
  useDismissKeyboard(visible);

  useEffect(() => {
    if (props.isVisible) {
      setVisible(true);
    } else {
      Keyboard.dismiss();
      modalContent.current?.dismiss();
    }
  }, [appExpired, props.isVisible]);

  // render
  return (
    <Portal hostName={'AppModal'}>
      {visible && (!appExpired || props.showOnUnAuthen) ? (
        <ModalContent onSetClose={closeModal} ref={modalContent} {...props} />
      ) : null}
    </Portal>
  );
};
