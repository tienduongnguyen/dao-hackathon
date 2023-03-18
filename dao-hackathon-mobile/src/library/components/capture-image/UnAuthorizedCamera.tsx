import React, { useEffect, useRef } from 'react';

import { openSettings } from 'react-native-permissions';

import { Block, Button, Icon, Text } from '@components';
import { goBack } from '@src/navigation/navigation-service';

import { NftBottom } from '../nft-bottom-sheet';

interface UnAuthorizedCameraProps {
  onClose?: () => void;
}

export const UnAuthorizedCamera = ({ onClose }: UnAuthorizedCameraProps) => {
  //state
  const nftBottomRef = useRef<NftBottom>();

  //funct
  const onClosePermissionPopup = () => {
    nftBottomRef.current?.hide();
  };
  const requestCameraPermission = () => {
    openSettings().then(() => {
      nftBottomRef.current?.hide();
      goBack();
    });
  };

  // effect
  useEffect(() => {
    nftBottomRef.current?.show(false);
  }, []);

  // render
  return (
    <Block block>
      <Block
        paddingHorizontal={20}
        height={70}
        justifyContent={'center'}
        alignItems={'flex-start'}
      >
        <Button onPress={onClose || goBack}>
          <Block padding={5}>
            <Icon icon={'back'} colorTheme={'white'} />
          </Block>
        </Button>
      </Block>
      <Block block middle justifyContent={'center'}>
        <Text
          preset={'notoSanBody2Regular'}
          colorTheme={'white'}
          text={'Camera not allow'}
          // tx={'error:txCameraNotAuthorized'}
        />
      </Block>
      <NftBottom
        ref={nftBottomRef}
        onClose={onClosePermissionPopup}
        onPressCancel={onClosePermissionPopup}
        onPressSubmit={requestCameraPermission}
      />
    </Block>
  );
};
