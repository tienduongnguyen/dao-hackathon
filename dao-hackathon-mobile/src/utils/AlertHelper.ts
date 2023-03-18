import { Alert, AlertButton } from 'react-native';

export const showConfirm = (
  title: string,
  content: string,
  action?: () => void,
  textCancel?: string,
  textConfirm?: string,
) => {
  Alert.alert(
    title,
    content,
    [
      {
        text: textCancel || 'Cancel',
        style: 'cancel',
      },
      {
        text: textConfirm || 'Confirm',
        onPress: action,
      },
    ],
    { cancelable: false },
  );
};

export const showMessages = (
  title: string,
  content: string,
  action?: () => void,
) => {
  setTimeout(() => {
    Alert.alert(
      title,
      content,
      [
        {
          text: 'OK',
          onPress: action,
        },
      ],
      { cancelable: false },
    );
  }, 100);
};

export const showOption = (
  title: string,
  content = '',
  options?: AlertButton[],
) => {
  setTimeout(() => {
    Alert.alert(title, content, options, {
      cancelable: true,
      onDismiss: () => null,
    });
  }, 100);
};
