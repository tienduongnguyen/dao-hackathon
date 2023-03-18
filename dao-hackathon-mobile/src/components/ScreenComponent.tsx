import React, { memo } from 'react';
import {
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';

import isEqual from 'react-fast-compare';

import { Error, Loading, LoadingProgress, RNHeader } from '@components-old';

import MenuListAddress from './MenuListAddress';
import PopupFullscreen from './PopupFullscreen';
import { useComponentsStyle } from './styles';
import { ScreenComponentProps } from './type';

const RenderBody = memo((props: ScreenComponentProps) => {
  //func
  const { styles } = useComponentsStyle();
  const { isLoading, isError, reload, children = <></> } = props;

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error reload={reload} />;
  }

  //render
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      style={styles.screenBody}
      children={children}
    />
  );
}, isEqual);

const ConfigBody = memo((props: ScreenComponentProps) => {
  //func
  const { styles } = useComponentsStyle();
  const { unsafe, scroll, scrollProps } = props;
  let configChildren = <RenderBody {...props} />;
  if (!unsafe) {
    configChildren = (
      <SafeAreaView style={styles.screenBodyConfig} children={configChildren} />
    );
  }
  if (scroll) {
    configChildren = <ScrollView {...scrollProps} children={configChildren} />;
  }
  return configChildren;
}, isEqual);

const ScreenComponent = (props: ScreenComponentProps) => {
  const {
    titleHeader,
    rightComponent = <MenuListAddress />,
    leftComponent,
    back,
    dialogLoading,
    popupFullscreen,
    onBack,
  } = props;

  return (
    <>
      {(!!titleHeader || !!rightComponent || !!leftComponent || !!back) && (
        <RNHeader
          titleHeader={titleHeader}
          back={back}
          onBack={onBack}
          rightComponent={rightComponent}
          leftComponent={leftComponent}
        />
      )}
      <StatusBar translucent barStyle={'light-content'} />
      <ConfigBody {...props} />
      {dialogLoading && <LoadingProgress />}
      {!!popupFullscreen && !!popupFullscreen.isShow && (
        <PopupFullscreen {...popupFullscreen} />
      )}
    </>
  );
};

export default memo(ScreenComponent, isEqual);
