import { Dimensions, StyleSheet } from 'react-native';

import { sizeScale } from '@src/common';

export const useScanStyle = () => {
  const { width } = Dimensions.get('window');

  const styles = StyleSheet.create({
    content: {
      paddingTop: 20,
      height: sizeScale(300),
    },
    container: {
      width: '100%',
    },
    card: {
      width: width - 36,
      height: 230,
      marginHorizontal: 18,
    },
    image: { flex: 1 },
  });
  return { styles };
};
