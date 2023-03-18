export const images = {
  splash: require('./source/img_splash.png'),
  empty: require('./source/empty.png'),
  sol: require('./source/solana.png'),
  bsc: require('./source/bsc.png'),
  polygon: require('./source/polygon.png'),
  pol: require('./source/polygon.png'),
  polygon_notify: require('./source/polygon_notify.png'),
};

export type ImageTypes = keyof typeof images;
