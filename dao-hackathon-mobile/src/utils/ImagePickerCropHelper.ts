/* eslint-disable react-native/split-platform-components */
import { ActionSheetIOS, PermissionsAndroid, Platform } from 'react-native';

import ImagePicker from 'react-native-image-crop-picker';

import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';

import { showOption } from './AlertHelper';

const imagePickerCropHelper = async (res: (uri: string) => void, uri?: any) => {
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
      startPickImage(res, uri);
    } else {
      PermissionsAndroid.requestMultiple([
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.CAMERA',
      ]).finally(() => {
        imagePickerCropHelper(res, uri);
      });
    }
  } else {
    startPickImage(res, uri);
  }
};

const startPickImage = (res: any, uri: any, readOnly = false) => {
  const titleChoose = 'photo';
  const titleTake = 'Take a photo';

  if (Platform.OS === 'ios') {
    let indexStart = 0;
    let options = [
      `Select ${titleChoose} from Camera roll`,
      titleTake,
      'Cancel',
    ];
    if (uri) {
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
        if (!!uri && buttonIndex === 0) {
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
            return pickCropFromLib(res);
          case indexStart + 1:
            return takeCropFromCamera(res);
          default:
            return;
        }
      },
    );
  } else {
    let options = [
      {
        text: `Select ${titleChoose} from Camera roll`,
        onPress: () => pickCropFromLib(res),
      },
      { text: titleTake, onPress: () => takeCropFromCamera(res) },
    ];

    if (uri) {
      options = [
        ...options,
        {
          text: `Xem ${titleChoose}`,
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
const pickCropFromLib = (res: any) => {
  try {
    ImagePicker.openPicker({
      includeBase64: false,
      compressImageQuality: 1,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      // width: 1000,
      // height: 1000,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
    }).then(async response => {
      const uri =
        Platform.OS === 'android'
          ? response.path
          : response.path?.replace('file://', '');
      return res(uri);
    });
  } catch (error) {
    console.log(error);
  }
};

const pickCropFromLibMulti = (res: any, min?: number, max?: number) => {
  try {
    ImagePicker.openPicker({
      includeBase64: false,
      compressImageQuality: 1,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      minFiles: min ?? 1,
      maxFiles: max ?? 5,
      multiple: true,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
    }).then(async response => {
      const result = response;
      const uri: Array<string> = [];
      result?.map(e => {
        return Platform.OS === 'android'
          ? uri.push(e.path ?? '')
          : uri.push(e.path?.replace('file://', '') ?? '');
      });
      return res(uri);
    });
  } catch (error) {
    console.log(error);
  }
};

const takeCropFromCamera = (res: any) => {
  try {
    ImagePicker.openCamera({
      includeBase64: false,
      compressImageQuality: 1,
      // width: 1000,
      // height: 1000,
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      useFrontCamera: false,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
    }).then(async response => {
      const uri =
        Platform.OS === 'android'
          ? response.path
          : response.path.replace('file://', '');
      return res(uri);
    });
  } catch (error) {
    console.log(error);
  }
};

const takeCropFromImage = (
  res: any,
  uri: string,
  width?: number,
  height?: number,
) => {
  try {
    ImagePicker.openCropper({
      path: uri ?? '',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      width: width,
      height: height,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async response => {
      const _uri = await (Platform.OS === 'android'
        ? response.path
        : response.path.replace('file://', ''));
      console.log(_uri);
      return res(_uri);
    });
  } catch (error) {
    console.log(error);
  }
};

export default imagePickerCropHelper;

export {
  takeCropFromCamera,
  pickCropFromLib,
  pickCropFromLibMulti,
  takeCropFromImage,
};
