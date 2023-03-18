/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line react-native/split-platform-components
import { ActionSheetIOS, PermissionsAndroid, Platform } from 'react-native';

import {
  launchCamera,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';

import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

import { showMessages, showOption } from './AlertHelper';
const listExtValid = ['jpg', 'jpeg', 'png', 'gif'];
const imagePickerHelper = async (
  res: (uri: string) => void,
  uri?: any,
  type: MediaType = 'photo',
  readOnly = false,
) => {
  if (Platform.OS !== 'ios') {
    const isRead = await PermissionsAndroid.check(
      'android.permission.READ_EXTERNAL_STORAGE',
    );
    const isWrite = await PermissionsAndroid.check(
      'android.permission.WRITE_EXTERNAL_STORAGE',
    );
    const isGrantCamera = await PermissionsAndroid.check(
      'android.permission.CAMERA',
    );
    if (isRead && isWrite && isGrantCamera) {
      startPickImage(res, uri, type, readOnly);
    } else {
      PermissionsAndroid.requestMultiple([
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.CAMERA',
      ]).finally(() => {
        imagePickerHelper(res, uri, type, readOnly);
      });
    }
  } else {
    startPickImage(res, uri, type, readOnly);
  }
};

const startPickImage = (
  res: any,
  uri: any,
  types: MediaType = 'photo',
  readOnly: boolean,
) => {
  const titleChoose = types === 'photo' ? 'photo' : 'video';
  const titleTake = types === 'photo' ? 'Take a photo' : 'Quay video';

  if (Platform.OS === 'ios') {
    let indexStart = 0;
    let options = [
      `Select ${titleChoose} from Camera roll`,
      titleTake,
      'Cancel',
    ];
    if (!!uri && types === 'photo') {
      options = ['View ' + titleChoose, ...options];
      indexStart = 1;
      if (readOnly) {
        options = ['View ' + titleChoose, 'Cancel'];
      }
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
      },
      buttonIndex => {
        if (!!uri && buttonIndex === 0 && types === 'photo') {
          navigate(AUTHORIZE_STACK.IMAGE_VIEW, {
            url: uri,
          });
          return;
        }
        if (readOnly) {
          return;
        }

        switch (buttonIndex) {
          case indexStart:
            return pickFromLib(res, types);
          case indexStart + 1:
            return takeFromCamera(res, types);
          default:
            return;
        }
      },
    );
  } else {
    let options = [
      {
        text: `Select ${titleChoose} from Camera roll`,
        onPress: () => pickFromLib(res, types),
      },
      { text: titleTake, onPress: () => takeFromCamera(res, types) },
    ];

    if (!!uri && types === 'photo') {
      options = [
        ...options,
        {
          text: `View ${titleChoose}`,
          onPress: () => {
            navigate(AUTHORIZE_STACK.IMAGE_VIEW, {
              url: uri,
            });
          },
        },
      ];
      if (readOnly) {
        options = [options[options.length - 1]];
      }
    }
    showOption('Select type upload photo', ' ', options);
  }
};

const pickFromLib = (
  res: any,
  mediaType: MediaType = 'photo',
  limit?: number,
  isNormalUri?: boolean,
) => {
  try {
    launchImageLibrary(
      {
        includeBase64: false,
        mediaType,
        quality: 1,
        maxWidth: 1000,
        maxHeight: 1000,
        selectionLimit: limit ?? 1,
      },
      async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          if (!limit || limit === 1) {
            const result = response?.assets![0];
            const uri =
              Platform.OS === 'android'
                ? result.uri
                : result?.uri?.replace('file://', '');

            if (listExtValid.includes(uri?.split('.')?.pop() || 'not')) {
              if (isNormalUri) {
                return res(result.uri);
              }

              return res(uri);
            }
          } else {
            const result = response?.assets;
            const uri: Array<string> = [];
            result?.map(e => {
              if (isNormalUri) {
                return res(e.uri);
              }

              return Platform.OS === 'android'
                ? uri.push(e.uri ?? '')
                : uri.push(e?.uri?.replace('file://', '') ?? '');
            });
            return res(uri);
          }

          return showMessages('Invalid file format. Please try again. 🤔', '');
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
};

const takeFromCamera = (res: any, mediaType: MediaType = 'photo') => {
  try {
    launchCamera(
      {
        includeBase64: false,
        mediaType,
        quality: 0.7,
        maxWidth: 1000,
        maxHeight: 1000,
        videoQuality: 'high',
        cameraType: 'front',
        saveToPhotos: false,
      },
      async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const result = response?.assets![0];

          const uri =
            Platform.OS === 'android'
              ? result.uri
              : result?.uri?.replace('file://', '');
          if (listExtValid.includes(uri?.split('.')?.pop() || 'not')) {
            return res(uri);
          }
          return showMessages('Invalid file format. Please try again. 🤔', '');
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
};

export { imagePickerHelper as imagePicker, pickFromLib, takeFromCamera };
