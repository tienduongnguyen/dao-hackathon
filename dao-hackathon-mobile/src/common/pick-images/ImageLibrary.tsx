/* eslint-disable react-native/no-unused-styles */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ListRenderItemInfo,
  Modal,
  Permission,
  Platform,
  StyleSheet,
} from 'react-native';

import { openSettings, PERMISSIONS, request } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { onCheckType, usePhotoPermission } from '@common';
import { Block, Icon, ListView, NftBottom, Text } from '@components';
import CameraRoll from '@react-native-community/cameraroll';

import { PADDING } from './constants';
import { ImageLibraryProps, Photo } from './ImageLibrary.props';
import { PhotoItem } from './PhotoItem';

const styles = StyleSheet.create({
  content: {
    padding: PADDING,
    width: '100%',
    height: '100%',
  },
  list: {
    width: '100%',
  },
});

const PAGE_SIZE_DEFAULT = 100;

const ImageLibraryComponent = ({
  maxSelect = 4,
  onChange,
  onHeaderLeft,
  onHeaderRight,
  isShowHeader = false,
  images = [],
  onEndReached,
}: ImageLibraryProps) => {
  // state
  const [listPhotos, setListPhotos] = useState<Array<Photo>>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);
  const [grantPermission] = usePhotoPermission();
  const [afterCursor, setAfterCursor] = useState<string | undefined>(undefined);
  const [selectedImages, setSelectedImages] = useState<Array<Photo>>(images);
  const insets = useSafeAreaInsets();

  const checkIconColor = useMemo(() => {
    if (maxSelect === 2) {
      if (selectedImages.length === maxSelect) {
        return 'white';
      }
      return 'text_color_gray';
    } else {
      if (selectedImages.length > 0) {
        return 'white';
      }
      return 'text_color_gray';
    }
  }, [maxSelect, selectedImages.length]);

  // function

  const onGetPhotos = useCallback(
    (after: string | undefined) => {
      console.log('LOAD_IMAGE', after);
      if ((!canLoadMore || !grantPermission) && after !== undefined) {
        return;
      }

      CameraRoll.getPhotos({
        first: PAGE_SIZE_DEFAULT,
        groupTypes: 'All',
        after: after,
        assetType: 'Photos',
        include: ['fileSize'],
      }).then(data => {
        setCanLoadMore(data.page_info.has_next_page);
        setAfterCursor(data.page_info.end_cursor);
        if (!after) {
          setListPhotos(
            data.edges
              .filter(x => (x.node.image?.fileSize ?? 0) < 10 * 1024 * 1024)
              .map((x, i) => {
                const { node } = x;

                return {
                  type: node.type,
                  groupName: node.group_name,
                  uri: node.image.uri,
                  fileName: node.image.filename ?? `newImage${i}`,
                  height: node.image.height,
                  width: node.image.width,
                  fileSize: node.image.fileSize,
                  timeStamp: node.timestamp,
                  latitude: node?.location?.latitude,
                  longitude: node?.location?.longitude,
                  altitude: node?.location?.altitude,
                  heading: node?.location?.heading,
                  speed: node?.location?.speed,
                };
              })
              .sort(el => new Date().getTime() - el.timeStamp * 1000),
          );
          return;
        }
        if (data.edges.length > 0) {
          setListPhotos(d =>
            d.concat(
              data.edges
                .filter(
                  x =>
                    (x.node.image?.fileSize ?? 0) < 10 * 1024 * 1024 &&
                    !d.find(f => f.uri === x.node?.image?.uri),
                )
                .map((x, i) => {
                  const { node } = x;
                  return {
                    type: node.type,
                    groupName: node.group_name,
                    uri: node.image.uri,
                    fileName: node.image.filename ?? `newImage${i}`,
                    height: node.image.height,
                    width: node.image.width,
                    fileSize: node.image.fileSize,
                    timeStamp: node.timestamp,
                    latitude: node?.location?.latitude,
                    longitude: node?.location?.longitude,
                    altitude: node?.location?.altitude,
                    heading: node?.location?.heading,
                    speed: node?.location?.speed,
                  };
                })
                .sort(el => new Date().getTime() - el.timeStamp * 1000),
            ),
          );
        }
      });
    },
    [canLoadMore, grantPermission],
  );

  const onSelectPhoto = useCallback(
    (photo: Photo) => {
      setSelectedImages(d => {
        const index = d.findIndex(x => x.uri === photo.uri);
        if (index < 0) {
          if (maxSelect === 1) {
            return [photo];
          } else if (d.length < maxSelect) {
            return d.concat([photo]);
          }
          return d;
        } else {
          return d.filter(x => x.uri !== photo.uri);
        }
      });
    },
    [maxSelect],
  );

  const kexExtractor = useCallback((item: Photo) => {
    return item.uri;
  }, []);

  const renderPhoto = useCallback(
    ({ item }: ListRenderItemInfo<Photo>) => {
      return (
        <PhotoItem
          photo={item}
          selected={selectedImages.find(x => x.uri === item.uri) !== undefined}
          onSelect={onSelectPhoto}
          isMaxSelected={
            maxSelect > 1 ? !(selectedImages.length >= maxSelect) : true
          }
        />
      );
    },
    [maxSelect, onSelectPhoto, selectedImages],
  );

  const onLoadMore = useCallback(() => {
    onGetPhotos(afterCursor);
  }, [afterCursor, onGetPhotos]);

  const onPressHeaderRight = useCallback(() => {
    const imagesConfirm: Array<string> = [];
    if (selectedImages.length > 0) {
      selectedImages.forEach(element => {
        imagesConfirm.push(element.uri);
      });
    }
    if (onHeaderRight && onCheckType(onHeaderRight, 'function')) {
      onHeaderRight(imagesConfirm);
    }
  }, [onHeaderRight, selectedImages]);

  const onPressNext = useCallback(() => {
    if (maxSelect === 2) {
      if (selectedImages.length === maxSelect) {
        onPressHeaderRight();
      }
    } else if (selectedImages.length > 0) {
      onPressHeaderRight();
    }
  }, [maxSelect, onPressHeaderRight, selectedImages.length]);

  // effect
  useEffect(() => {
    if (onChange && onCheckType(onChange, 'function')) {
      onChange(selectedImages);
    }
  }, [onChange, selectedImages]);

  useEffect(() => {
    if (grantPermission === 'granted') {
      onGetPhotos(undefined);
    }
  }, [grantPermission, onGetPhotos]);

  // render
  return (
    <Block block colorTheme="background">
      {isShowHeader ? (
        <Block
          direction="row"
          middle
          justifyContent="space-between"
          paddingTop={insets.top + 10}
          paddingBottom={30}
        >
          <Block marginLeft={20}>
            <Icon
              icon={'close'}
              size={24}
              colorTheme={'white'}
              onPress={onHeaderLeft}
            />
          </Block>
          <Text text="Printers" colorTheme={'white'} preset="notoSanBold14" />
          <Block marginRight={20}>
            <Icon
              icon={'check'}
              size={24}
              colorTheme={checkIconColor}
              onPress={onPressNext}
            />
          </Block>
        </Block>
      ) : null}
      {isShowHeader ? (
        <Text
          text="Only under 10MB images are able to be selected"
          colorTheme="white"
          textAlign="center"
          preset="notoSanBold14"
        />
      ) : null}
      <Block block>
        <ListView
          canLoadMore={canLoadMore}
          canRefresh={false}
          data={listPhotos}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
          keyExtractor={kexExtractor}
          renderItem={renderPhoto}
          style={[styles.list]}
          onEndReachedThreshold={0.5}
          onLoadMore={!isShowHeader ? onEndReached : onLoadMore}
          showsVerticalScrollIndicator={false}
          windowSize={PAGE_SIZE_DEFAULT * 2}
        />
      </Block>
    </Block>
  );
};

const ImageLibrary = forwardRef((props: ImageLibraryProps, ref: any) => {
  // state
  const [visible, setVisible] = useState(false);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [maxSelect, setMaxSelect] = useState(1);
  // eslint-disable-next-line no-spaced-func
  const [onHeaderRight, setOnHeaderRight] = useState<
    ((images: Array<string>) => void) | undefined
  >(undefined);
  const nftBottomRef = useRef<NftBottom>();

  const handleSubmitPermission = () => {
    openSettings().then(() => {
      nftBottomRef.current?.hide();
      setVisible(false);
    });
  };

  const handleClosePermission = () => {
    setVisible(false);
    nftBottomRef.current?.hide();
  };

  // func
  const handleShowModal = (data: ModalPickImageType) => {
    const {
      maxSelect: maxSelectValue,
      onHeaderRight: onHeaderRightCb,
      isShowHeader: isShowHeaderValue,
    } = data || {};

    if (isShowHeaderValue) {
      setIsShowHeader(isShowHeaderValue);
    }

    if (maxSelectValue !== undefined) {
      setMaxSelect(maxSelectValue);
    }

    if (onCheckType(onHeaderRightCb, 'function')) {
      setOnHeaderRight(() => onHeaderRightCb);
    }

    setVisible(true);
  };

  const onCheckPermission = useCallback(async (data: ModalPickImageType) => {
    const result = await request(
      Platform.select({
        android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      }) as Permission,
    );

    if (result !== 'granted') {
      nftBottomRef.current?.show(true);
    } else {
      console.log({ data });
      console.log({ result });
      handleShowModal(data);
    }
  }, []);

  const handleHideModal = useCallback(() => {
    setIsShowHeader(false);
    setMaxSelect(1);
    setOnHeaderRight(undefined);
    setVisible(false);
  }, []);

  // effect
  useImperativeHandle(ref, () => ({
    show: onCheckPermission,
    hide: handleHideModal,
  }));

  // useEffect(() => {
  //   if (grantState && grantState !== 'granted' && visible) {
  //     setVisible(false);
  //     nftBottomRef.current?.show(true);
  //   }
  // }, [grantState, visible]);

  // usePhotosPermissionChange(() => {
  //   setVisible(true);
  //   nftBottomRef.current?.hide();
  // });

  // render
  return (
    <>
      <NftBottom
        ref={nftBottomRef}
        onClose={handleClosePermission}
        onPressCancel={handleClosePermission}
        onPressSubmit={handleSubmitPermission}
      />
      <Modal animated visible={visible} animationType={'fade'} transparent>
        <ImageLibraryComponent
          {...props}
          isShowHeader={isShowHeader}
          maxSelect={maxSelect}
          onHeaderRight={onHeaderRight}
          onHeaderLeft={handleHideModal}
        />
      </Modal>
    </>
  );
});

export type ModalPickImage = {
  show: (data: ModalPickImageType) => void;
  hide: () => void;
};

interface ModalPickImageType {
  maxSelect?: number;
  onHeaderRight?: (images: Array<string>) => void | undefined;
  isShowHeader?: boolean;
}

const modalPickImageRef = React.createRef<ModalPickImage>();

export const ModalPickImage = () => {
  return <ImageLibrary ref={modalPickImageRef} />;
};

export const showModalPickImage = (data: ModalPickImageType) => {
  modalPickImageRef.current?.show(data);
};

export const hiddenModalPickImage = () => {
  modalPickImageRef.current?.hide();
};
