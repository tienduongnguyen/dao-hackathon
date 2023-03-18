/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { LogBox, Platform, StyleSheet, UIManager } from 'react-native';

import CodePush from 'react-native-code-push';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, {
  BaseToastProps,
  SuccessToast,
} from 'react-native-toast-message';
import { Provider } from 'react-redux';

import { isIos } from '@src/common';
import { PortalProvider } from '@src/library/components';
import { AppContainer } from '@src/navigation/app-navigation';
import store from '@src/redux/store';
import './src/library/utils/i18n/i18n';
LogBox.ignoreLogs(['EventEmitter.removeListener']);

// const initialSentry = () => {
// Sentry.init({
//   dsn: 'https://66032ebee86440b9a05a328c78ea78dd@o956200.ingest.sentry.io/5905563',
//   debug: __DEV__,
//   enableAutoSessionTracking: true,
//   sessionTrackingIntervalMillis: 10000,
//   denyUrls: [
//     // Facebook flakiness
//     /graph\.facebook\.com/i,
//     // Facebook blocked
//     /connect\.facebook\.net\/en_US\/all\.js/i,
//     // Woopra flakiness
//     /eatdifferent\.com\.woopra-ns\.com/i,
//     /static\.woopra\.com\/js\/woopra\.js/i,
//     // Chrome extensions
//     /extensions\//i,
//     /^chrome:\/\//i,
//     // Other plugins
//     /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
//     /webappstoolbarba\.texthelp\.com\//i,
//     /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
//   ],
// });
// };

if (!isIos) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  imageLoad: {
    width: 5,
    height: 5,
    opacity: 0,
    position: 'absolute',
    zIndex: -999,
  },
});

const App = () => {
  // useEffect(() => {
  //   if (!__DEV__) {
  //     initialSentry();
  //   }
  //   OneSignalHelper.initialization('e3f3987f-cdd8-4a65-9410-c4ae4eee18fa');
  //   // setTimeout(() => {
  //   //   RNBootSplash.hide({ fade: true });
  //   // }, 1000);
  //   OneSignalHelper.getDeviceState().then(deviceState => {
  //     console.log('deviceState', deviceState.userId);
  //     AsyncStorage.setItem(ASYNC_STORAGE.USER_ID, deviceState.userId);
  //   });
  // }, []);

  // useEffect(() => () => {
  //   OneSignalHelper.destruction();
  // });

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <SuccessToast {...props} onPress={props.onPress} />
    ),
  };

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GestureHandlerRootView style={[styles.root]}>
          <PortalProvider>
            <AppContainer />
          </PortalProvider>
        </GestureHandlerRootView>
      </Provider>
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
};

// const MyApp = CodePush({
//   checkFrequency:
//     Platform.OS === 'ios' || __DEV__
//       ? CodePush.CheckFrequency.MANUAL
//       : CodePush.CheckFrequency.ON_APP_START,
// })(App);

export default App;
