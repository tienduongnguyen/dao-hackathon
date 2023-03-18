import { Platform } from 'react-native';

import Share from 'react-native-share';

/**
 * This function shares PDF and PNG files to
 * the Files app that you send as the urls param
 */
// for ios
const shareToFiles = async (urls?: string[], title?: string) => {
  const shareOptions = {
    title: title ?? '',
    failOnCancel: false,
    saveToFiles: false,
    urls: urls, // base64 with mimeType or path to local file
  };
  // If you want, you can use a try catch, to parse
  // the share response. If the user cancels, etc.
  try {
    await Share.open(shareOptions);
  } catch (error) {
    console.log('Error =>', error);
  }
};

// For android
const sharePdfBase64 = async (data: string) => {
  const shareOptions = {
    url: `file://${data}`,
    type: 'application/xlsx',
    showAppsToView: true,
    title: 'Export NFTs detail',
  };
  try {
    await Share.open(shareOptions);
  } catch (error) {
    console.log('sharePdfBase64 Error =>', error);
  }
};

export const shareFile = async (url?: string[], type?: 'export' | 'share') => {
  if (type === 'export') {
    if (Platform.OS === 'ios') {
      shareToFiles(url, 'Export NFTs detail');
    } else {
      sharePdfBase64(url?.[0] ?? '');
    }
  } else {
    shareToFiles(url, 'Share URL');
  }

  return true;
};
