/* eslint-disable @typescript-eslint/no-non-null-assertion */
import DeviceInfo from 'react-native-device-info';

import AsyncStorage from '@react-native-community/async-storage';
import ReactTron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import sagaPlugin from 'reactotron-redux-saga';

const scriptHostname = DeviceInfo.isEmulatorSync()
  ? 'localhost'
  : '192.168.3.234';

const reactotron = ReactTron.configure({ host: scriptHostname })
  // .configure("RN Base")
  .use(reactotronRedux()).setAsyncStorageHandler!(AsyncStorage)
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .use(sagaPlugin({}))
  .connect();

export default reactotron;
