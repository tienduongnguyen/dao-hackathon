import { onChangeAlias } from '../string/index';

/**
 * Sort array by text by all properties
 */
export const onSearchAllProperties = (
  source: Array<any>,
  textSearch: string | number,
): Array<any> => {
  return source.filter(x => {
    return Object.keys(x).some(function (key) {
      return onChangeAlias(x[key]).search(onChangeAlias(textSearch)) !== -1;
    });
  });
};
/**
 * Sort array by text by all properties
 */
export const onSearchByKey = <T = any>(
  source: Array<T>,
  textSearch: string,
  keys: Array<keyof T>,
): Array<T> => {
  return source.filter(x => {
    return keys.some(function (key) {
      return (
        onChangeAlias(String(x[key] as unknown as string)).search(
          onChangeAlias(textSearch),
        ) !== -1
      );
    });
  });
};
/**
 * Check source is Array. Otherwise, return [].
 */
export const onCheckArray = (source: any) => {
  if (Array.isArray(source)) {
    return source;
  }
  return [];
};

export const arrayNotEmpty = (source: any): source is Array<any> => {
  if (onCheckArray(source).length > 0) {
    return true;
  }
  return false;
};

export const rearrangeData = (uri: Array<string>) => {
  return uri.map((item, index) => ({
    id: String(index + 1),
    img: item,
    card_name: '',
    description: '',
  }));
};
export const twoSideData = (uri: Array<string>) => {
  return {
    img: uri,
    card_name: '',
    description: '',
  };
};
