import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  LayoutChangeEvent,
  Linking,
  Platform,
  TextStyle,
} from 'react-native';

import ColorPicker from 'react-native-color-picker-ios';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';

import { useIsFocused } from '@react-navigation/native';
import { IconTypes } from '@src/assets/icon';
import {
  hiddenModalPickImage,
  randomUniqueId,
  showModalPickImage,
  sizeScale,
} from '@src/common';
import {
  Block,
  BottomIcon,
  Button,
  HeaderAuthentication,
  Icon,
  NftBottom,
  Screen,
  Spacer,
} from '@src/library/components';
import { BottomInput } from '@src/library/components/bottom-input';
import BottomSheet from '@src/library/components/bottom-sheet';
import { SelectAction } from '@src/library/components/select-action';
import { goBack, navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { useTheme } from '@src/themes';
import { takeFromCamera } from '@src/utils';
import { takeCropFromImage } from '@src/utils/ImagePickerCropHelper';

import { CardLabel } from './components/card-label';
import { DragDropZone } from './components/drag-drop-zone';
import { ImagePlaceholder } from './components/image-placeholder';
import { SelectBackground } from './components/select-background';
import { TextDescription } from './components/text-description';
import { Tools } from './components/tools';
import { TrashCan } from './components/trash-can';
import { styles } from './style';
import { Description, DesignCardProps, ImageType, Layout } from './type';

// const
const DEFAULT_TEXT_STYLE: TextStyle = {
  fontSize: sizeScale(14),
  color: '#000000',
  fontWeight: '400',
  textDecorationLine: 'none',
  fontStyle: 'normal',
  textAlign: 'left',
};

export const DesignCardScreen = ({ route }: DesignCardProps) => {
  //state
  const { type } = route.params;
  const { colors } = useTheme();
  const isFocus = useIsFocused();
  const [frontBackground, setFrontBackground] = useState('');
  const [backBackground, setBackBackground] = useState('');
  const [colorFrontBackground, setColorFrontBackground] = useState('white');
  const [colorBackBackground, setColorBackBackground] = useState('white');
  const [isFront, setIsFront] = useState(true);
  const [isBack, setIsBack] = useState(false);
  const [isVisibleBack, setIsVisibleBack] = useState(false);
  const [isGrantPhotoPermission, setIsGrantPhotoPermission] = useState(true);
  const [isGrantCameraPermission, setIsGrantCameraPermission] = useState(true);
  const selectBackgroundRef = useRef<SelectBackground>();
  const selectPhotoRef = useRef<SelectAction>();
  const photoRef = useRef<NftBottom>();
  const cameraRef = useRef<NftBottom>();
  const bottomInputRef = useRef<BottomInput>();
  const frontRef = useRef<ViewShot>(null);
  const backRef = useRef<ViewShot>(null);
  const bottomIconRef = useRef<BottomIcon>(null);
  const [typePopup, setTypePopup] = useState<'background' | 'photo'>();

  const [frontDescriptions, setFrontDescriptions] = useState<
    Array<Description>
  >([]);
  const [backDescriptions, setBackDescriptions] = useState<Array<Description>>(
    [],
  );
  const [selectedDescription, setSelectedDescription] = useState<Description>(
    {} as Description,
  );

  const [frontImages, setFrontImages] = useState<Array<ImageType>>([]);
  const [backImages, setBackImages] = useState<Array<ImageType>>([]);
  const hold = useSharedValue(false);
  const [isHold, setIsHold] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [trashLayout, setTrashLayout] = useState<Layout>({
    x: 0,
    y: 0,
  });
  const [frontLayout, setFrontLayout] = useState<Layout>({
    x: 0,
    y: 0,
  });
  const [backLayout, setBackLayout] = useState<Layout>({
    x: 0,
    y: 0,
  });
  const [cardY, setCardY] = useState(0);
  const insets = useSafeAreaInsets();

  const isEdited = useMemo<boolean>(
    () =>
      frontBackground.length !== 0 ||
      backBackground.length !== 0 ||
      colorFrontBackground !== 'white' ||
      colorBackBackground !== 'white' ||
      frontDescriptions.length !== 0 ||
      backDescriptions.length !== 0 ||
      frontImages.length !== 0 ||
      backImages.length !== 0,
    [
      backBackground.length,
      backDescriptions.length,
      backImages.length,
      colorBackBackground,
      colorFrontBackground,
      frontBackground.length,
      frontDescriptions.length,
      frontImages.length,
    ],
  );

  const frontCardBorder = useMemo(
    () => ({
      borderWidth: sizeScale(2),
      borderColor: isFront ? colors.primary4 : colors.background,
    }),
    [colors.background, colors.primary4, isFront],
  );

  const backCardBorder = useMemo(
    () => ({
      borderWidth: sizeScale(2),
      borderColor: isBack ? colors.primary4 : colors.background,
    }),
    [colors.background, colors.primary4, isBack],
  );

  //func
  const onCallbackSelectBackground = useCallback(
    (uri: any) => {
      hiddenModalPickImage();
      if (isFront) {
        setFrontBackground(uri);
      }
      if (isBack) {
        setBackBackground(uri);
      }
    },
    [isBack, isFront],
  );

  const onCropBackgroundGallery = useCallback(
    (res: any) => {
      takeCropFromImage(onCallbackSelectBackground, res[0], 1920, 1080);
    },
    [onCallbackSelectBackground],
  );

  const onCropBackgroundCapture = useCallback(
    (res: any) => {
      takeCropFromImage(onCallbackSelectBackground, res, 1920, 1080);
    },
    [onCallbackSelectBackground],
  );

  const onCallbackSelectImage = useCallback(
    (uri: string | string[]) => {
      hiddenModalPickImage();
      if (isFront) {
        setFrontImages(image => [
          ...image,
          { id: randomUniqueId(), url: typeof uri === 'string' ? uri : uri[0] },
        ]);
      }
      if (isBack) {
        setBackImages(image => [
          ...image,
          { id: randomUniqueId(), url: typeof uri === 'string' ? uri : uri[0] },
        ]);
      }
    },
    [isBack, isFront],
  );

  const onCropImagePhoto = useCallback(
    (res: any) => {
      takeCropFromImage(onCallbackSelectImage, res);
    },
    [onCallbackSelectImage],
  );

  const onCropImageGallery = useCallback(
    (res: any) => {
      takeCropFromImage(onCallbackSelectImage, res[0], 1920, 1080);
    },
    [onCallbackSelectImage],
  );

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantCamera = await check(PERMISSIONS.IOS.CAMERA);
      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.CAMERA);

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantCameraPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        }
      }
    } else {
      const isGrantCamera = await check(PERMISSIONS.ANDROID.CAMERA);

      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.ANDROID.CAMERA);

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantCameraPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        }
        if (isGrant === RESULTS.BLOCKED) {
          Linking.openSettings();
        }
      }
    }
  };

  const checkCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantCamera = await check(PERMISSIONS.IOS.CAMERA);
      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.CAMERA);
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        } else {
          setIsGrantCameraPermission(false);
        }
      }
    } else {
      const isGrantCamera = await check(PERMISSIONS.ANDROID.CAMERA);
      setIsGrantCameraPermission(isGrantCamera === RESULTS.GRANTED);
      if (isGrantCamera !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.ANDROID.CAMERA);

        if (isGrant === RESULTS.GRANTED) {
          setIsGrantCameraPermission(true);
        } else {
          setIsGrantCameraPermission(false);
        }
      }
    }
  };

  const requestPhotosPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantPhoto = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantPhotoPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        }
      }
    } else {
      const isGrantPhoto = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );

        if (isGrant !== RESULTS.GRANTED) {
          Linking.openSettings();
          setIsGrantPhotoPermission(false);
        }
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        }
        if (isGrant === RESULTS.BLOCKED) {
          Linking.openSettings();
        }
      }
    }
  };

  const checkPhotosPermission = async () => {
    if (Platform.OS === 'ios') {
      const isGrantPhoto = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        } else {
          setIsGrantPhotoPermission(false);
        }
      }
    } else {
      const isGrantPhoto = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      setIsGrantPhotoPermission(isGrantPhoto === RESULTS.GRANTED);
      if (isGrantPhoto !== RESULTS.GRANTED) {
        const isGrant = await request(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );

        if (isGrant === RESULTS.GRANTED) {
          setIsGrantPhotoPermission(true);
        } else {
          setIsGrantPhotoPermission(false);
        }
      }
    }
  };

  const allowPhotoPermissions = () => {
    photoRef.current?.hide();
    requestPhotosPermission();
  };
  const allowCameraPermissions = () => {
    cameraRef.current?.hide();
    setTimeout(() => {
      requestCameraPermission();
    }, 300);
  };

  const onClosePermissionCameraPopup = () => {
    cameraRef.current?.hide();
    setTimeout(() => {
      if (typePopup === 'background') {
        selectBackgroundRef.current?.show();
      } else {
        selectPhotoRef.current?.show();
      }
    }, 300);
  };

  const onClosePermissionPhotoPopup = () => {
    photoRef.current?.hide();
    setTimeout(() => {
      if (typePopup === 'background') {
        selectBackgroundRef.current?.show();
      } else {
        selectPhotoRef.current?.show();
      }
    }, 300);
  };

  const showPermissionCameraPopup = () => {
    selectBackgroundRef.current?.hide();
    setTimeout(() => {
      cameraRef.current?.show(false);
    }, 300);
  };

  const showPermissionPhotoPopup = () => {
    selectBackgroundRef.current?.hide();
    setTimeout(() => {
      photoRef.current?.show(true);
    }, 300);
  };

  const onShowPopupBack = () => {
    if (isEdited) {
      setIsVisibleBack(true);
    } else {
      goBack();
    }
  };

  const onBack = () => {
    setIsVisibleBack(false);
    goBack();
  };

  const onClosePopupBack = () => {
    setIsVisibleBack(false);
  };
  const onPressBackground = () => {
    selectBackgroundRef.current?.show();
    setTypePopup('background');
  };

  const onPressAddPhoto = () => {
    selectPhotoRef.current?.show();
    setTypePopup('photo');
  };

  const onPressEmoji = () => {
    bottomIconRef.current?.show();
  };

  const onPressText = useCallback(() => {
    const newItem: Description = {
      id: randomUniqueId(),
      text: '',
      isShow: false,
      ...DEFAULT_TEXT_STYLE,
    };

    if (isFront) {
      setFrontDescriptions(d => {
        setSelectedDescription(newItem);
        return d.concat(newItem);
      });
    } else {
      setBackDescriptions(d => {
        setSelectedDescription(newItem);
        return d.concat(newItem);
      });
    }
    bottomInputRef.current?.show(newItem);
  }, [isFront]);

  //Background
  const onPressGalleryBackground = useCallback(() => {
    selectBackgroundRef.current?.hide();
    selectPhotoRef.current?.hide();
    showModalPickImage({
      onHeaderRight: onCropBackgroundGallery,
      maxSelect: 1,
      isShowHeader: true,
    });
  }, [onCropBackgroundGallery]);

  const onPressPhotoBackground = useCallback(() => {
    selectBackgroundRef.current?.hide();
    selectPhotoRef.current?.hide();
    takeFromCamera(onCropBackgroundCapture, 'photo');
  }, [onCropBackgroundCapture]);
  //

  //Image
  const onPressGallery = useCallback(() => {
    selectBackgroundRef.current?.hide();
    selectPhotoRef.current?.hide();
    showModalPickImage({
      onHeaderRight: onCropImageGallery,
      isShowHeader: true,
      maxSelect: 1,
    });
  }, [onCropImageGallery]);

  const onPressPhoto = useCallback(() => {
    selectBackgroundRef.current?.hide();
    selectPhotoRef.current?.hide();
    takeFromCamera(onCropImagePhoto, 'photo');
  }, [onCropImagePhoto]);
  //

  const onPressColor = () => {
    selectBackgroundRef.current?.hide();
    ColorPicker.showColorPicker(
      {
        supportsAlpha: true,
        initialColor: isFront ? colorFrontBackground : colorBackBackground,
      },
      color => {
        if (isFront) {
          setFrontBackground('');
          setColorFrontBackground(color);
        }
        if (isBack) {
          setBackBackground('');
          setColorBackBackground(color);
        }
      },
    );
  };

  const onFocusFront = () => {
    setIsFront(true);
    setIsBack(false);
  };

  const onFocusBack = () => {
    setIsFront(false);
    setIsBack(true);
  };

  const onChangeText = useCallback(
    (text: string) => {
      if (isFront) {
        setFrontDescriptions(d =>
          d.map(item => {
            if (item.id === selectedDescription.id) {
              return { ...item, text };
            }
            return item;
          }),
        );
        setSelectedDescription(x => ({ ...x, text }));
      } else {
        setBackDescriptions(d =>
          d.map(item => {
            if (item.id === selectedDescription.id) {
              return { ...item, text };
            }
            return item;
          }),
        );
        setSelectedDescription(x => ({ ...x, text }));
      }
    },
    [isFront, selectedDescription.id],
  );

  const onChangeStyle = useCallback(
    (key: keyof TextStyle, value: number | string | undefined) => {
      if (isFront) {
        setFrontDescriptions(x =>
          x.map(item => {
            if (item.id === selectedDescription.id) {
              return { ...item, [key]: value };
            }
            return item;
          }),
        );
      } else {
        setBackDescriptions(x =>
          x.map(item => {
            if (item.id === selectedDescription.id) {
              return { ...item, [key]: value };
            }
            return item;
          }),
        );
      }
    },
    [isFront, selectedDescription.id],
  );

  const onSelect = useCallback(
    (item: Description) => {
      return () => {
        setSelectedDescription(item);
        if (isFront) {
          setFrontDescriptions(d =>
            d.map(x => {
              if (x.id === item.id) {
                return { ...x, isShow: false };
              }
              return x;
            }),
          );
        } else {
          setBackDescriptions(d =>
            d.map(x => {
              if (x.id === item.id) {
                return { ...x, isShow: false };
              }
              return x;
            }),
          );
        }
        bottomInputRef.current?.show(item);
      };
    },
    [isFront],
  );

  const onToggleHold = useCallback(
    (value: boolean) => {
      hold.value = value;
    },
    [hold],
  );

  const onToggleDelete = useCallback((value: boolean) => {
    setCanDelete(value);
  }, []);

  const onDelete = useCallback(
    (deleteId: string) => {
      if (isFront) {
        setFrontDescriptions(d =>
          d.filter(item => String(item.id) !== deleteId),
        );
      } else {
        setBackDescriptions(d =>
          d.filter(item => String(item.id) !== deleteId),
        );
      }
      setSelectedDescription({} as Description);
    },
    [isFront],
  );
  const onDeleteImage = useCallback(
    (deleteId: string) => {
      if (isFront) {
        setFrontImages(d => d.filter(item => String(item.id) !== deleteId));
      } else {
        setBackImages(d => d.filter(item => String(item.id) !== deleteId));
      }
      // setSelectedDescription({} as Description);
    },
    [isFront],
  );
  const renderDescription = useCallback(
    (item: Description, side: string) => {
      return (
        <TextDescription
          key={item.id}
          item={item}
          onSelect={onSelect(item)}
          onToggleHold={onToggleHold}
          onToggleDelete={onToggleDelete}
          onDelete={onDelete}
          trashLayout={trashLayout}
          layout={isFront ? frontLayout : backLayout}
          enabled={side === 'front' ? isFront : isBack}
          cardY={cardY}
        />
      );
    },
    [
      onSelect,
      onToggleHold,
      onToggleDelete,
      onDelete,
      trashLayout,
      isFront,
      frontLayout,
      backLayout,
      isBack,
      cardY,
    ],
  );

  const renderImage = useCallback(
    (item: ImageType, side: string) => {
      return (
        <DragDropZone
          key={item.id}
          id={item.id}
          isIcon={item?.isIcon}
          // onSelect={onSelect(item)}
          onToggleHold={onToggleHold}
          onToggleDelete={onToggleDelete}
          onDelete={onDeleteImage}
          trashLayout={trashLayout}
          layout={isFront ? frontLayout : backLayout}
          enabled={side === 'front' ? isFront : isBack}
          cardY={cardY}
          children={
            item?.isIcon ? (
              <Icon icon={item.url as IconTypes} size={80} />
            ) : (
              <Image
                source={{ uri: item.url }}
                style={{ height: 100, width: 100 }}
                resizeMode="contain"
              />
            )
          }
        />
      );
    },
    [
      onToggleHold,
      onToggleDelete,
      onDeleteImage,
      trashLayout,
      isFront,
      frontLayout,
      backLayout,
      isBack,
      cardY,
    ],
  );
  const onCloseModal = useCallback(() => {
    if (selectedDescription.text === '') {
      if (isFront) {
        setFrontDescriptions(d =>
          d.filter(item => String(item.id) !== selectedDescription.id),
        );
      } else {
        setBackDescriptions(d =>
          d.filter(item => String(item.id) !== selectedDescription.id),
        );
      }
    }
    if (isFront) {
      setFrontDescriptions(d =>
        d.map(item => {
          if (item.id === selectedDescription.id) {
            return { ...item, isShow: true };
          }
          return item;
        }),
      );
    } else {
      setBackDescriptions(d =>
        d.map(item => {
          if (item.id === selectedDescription.id) {
            return { ...item, isShow: true };
          }
          return item;
        }),
      );
    }
    setSelectedDescription({} as Description);
  }, [isFront, selectedDescription.id, selectedDescription.text]);

  const onLayoutCard = (event: LayoutChangeEvent) => {
    setCardY(event.nativeEvent.layout.y + insets.top);
  };

  const onLayoutTrashFront = (event: LayoutChangeEvent) => {
    event.persist();
    setTrashLayout({
      x: event.nativeEvent.layout.x,
      y: event.nativeEvent.layout.y,
    });
  };

  const onLayoutFront = useCallback((event: LayoutChangeEvent) => {
    setFrontLayout(event.nativeEvent.layout);
  }, []);

  const onLayoutBack = useCallback((event: LayoutChangeEvent) => {
    setBackLayout(event.nativeEvent.layout);
  }, []);

  const renderTwoSide = () => {
    return (
      <>
        <Button
          onLayout={onLayoutFront}
          onPress={onFocusFront}
          style={frontCardBorder}
        >
          <CardLabel type={'Front'} />
          <ViewShot
            style={styles.cardStyle}
            ref={frontRef}
            options={{ quality: 1 }}
          >
            <ImagePlaceholder
              background={frontBackground}
              colorBackground={colorFrontBackground}
            />
            {frontImages.map(item => {
              return (
                <React.Fragment key={item.id}>
                  {renderImage(item, 'front')}
                </React.Fragment>
              );
            })}
            {frontDescriptions.map(item => {
              return (
                <React.Fragment key={item.id}>
                  {renderDescription(item, 'front')}
                </React.Fragment>
              );
            })}
            <TrashCan
              onLayout={onLayoutTrashFront}
              canDelete={canDelete && isFront}
              isHold={isHold && isFront}
            />
          </ViewShot>
        </Button>
        <Spacer height={24} />
        <Button
          onLayout={onLayoutBack}
          onPress={onFocusBack}
          style={backCardBorder}
        >
          <CardLabel type={'Back'} />
          <ViewShot
            style={styles.cardStyle}
            ref={backRef}
            options={{ quality: 1 }}
          >
            <ImagePlaceholder
              background={backBackground}
              colorBackground={colorBackBackground}
            />
            {backImages.map(item => {
              return (
                <React.Fragment key={item.id}>
                  {renderImage(item, 'back')}
                </React.Fragment>
              );
            })}
            {backDescriptions.map(item => {
              return (
                <React.Fragment key={item.id}>
                  {renderDescription(item, 'back')}
                </React.Fragment>
              );
            })}
            <TrashCan
              canDelete={canDelete && isBack}
              isHold={isHold && isBack}
            />
          </ViewShot>
        </Button>
      </>
    );
  };

  const renderOneSide = useCallback(() => {
    return (
      <Button
        onLayout={onLayoutFront}
        onPress={!isFront ? onFocusFront : undefined}
        style={frontCardBorder}
      >
        {/* <CardLabel type={'Front'} /> */}
        <ViewShot
          style={styles.cardStyle}
          ref={frontRef}
          options={{ quality: 1 }}
        >
          <ImagePlaceholder
            background={frontBackground}
            colorBackground={colorFrontBackground}
          />
          {frontImages.map(item => {
            return (
              <React.Fragment key={item.id}>
                {renderImage(item, 'front')}
              </React.Fragment>
            );
          })}
          {frontDescriptions.map(item => {
            return (
              <React.Fragment key={item.id}>
                {renderDescription(item, 'front')}
              </React.Fragment>
            );
          })}

          <TrashCan
            onLayout={onLayoutTrashFront}
            canDelete={canDelete}
            isHold={isHold}
          />
        </ViewShot>
      </Button>
    );
  }, [
    canDelete,
    colorFrontBackground,
    frontBackground,
    frontCardBorder,
    frontDescriptions,
    frontImages,
    isHold,
    onLayoutFront,
    renderDescription,
    renderImage,
  ]);

  const onCaptureView = async () => {
    const data: string[] = [];
    if (frontRef.current?.capture) {
      await frontRef.current.capture().then(uri => {
        data.push(uri);
      });
    }
    if (type === '2-sided' && backRef.current?.capture) {
      await backRef.current.capture().then(uri => {
        data.push(uri);
      });
    }

    if (type === '2-sided') {
      navigate(AUTHORIZE_STACK.RENAME_TWO_SIDE, {
        data: data,
        isHidePopup: true,
      });
    } else {
      navigate(AUTHORIZE_STACK.RENAME_TWO_SIDE, {
        data: data,
        isOneSide: true,
        isHidePopup: true,
      });
    }
  };
  const onSelectIcon = (icon: IconTypes) => {
    if (isFront) {
      setFrontImages(image => [
        ...image,
        { id: randomUniqueId(), url: icon, isIcon: true },
      ]);
    }
    if (isBack) {
      setBackImages(image => [
        ...image,
        { id: randomUniqueId(), url: icon, isIcon: true },
      ]);
    }
  };
  //effect
  useEffect(() => {
    if (isFocus) {
      checkCameraPermission();
      checkPhotosPermission();
    }
  }, [isFocus]);

  useAnimatedReaction(
    () => {
      return {
        hold: hold.value,
      };
    },
    value => {
      runOnJS(setIsHold)(value.hold);
    },
  );

  //render
  return (
    <Screen statusBarStyle="light-content">
      <HeaderAuthentication txTitle="Customize" onPress={onShowPopupBack} />
      <Spacer height={23} />
      <Block
        block
        onLayout={onLayoutCard}
        paddingHorizontal={16}
        overflow="hidden"
      >
        {type === '1-sided' ? renderOneSide() : renderTwoSide()}
      </Block>

      <Block paddingHorizontal={16}>
        <Button
          text="Next"
          onPress={onCaptureView}
          preset="primary"
          typePreset="medium"
          textColorTheme="text1"
          gradient={colors.gradient}
        />
      </Block>
      <Spacer height={40} />
      <Tools
        onPressBackground={onPressBackground}
        onPressAddPhoto={onPressAddPhoto}
        onPressEmoji={onPressEmoji}
        onPressText={onPressText}
      />
      <SelectAction
        ref={selectPhotoRef}
        option={[
          {
            text: 'Select photo from Camera roll',
            icon: 'gallery',
            itemCallback: isGrantPhotoPermission
              ? onPressGallery
              : showPermissionPhotoPopup,
          },
          {
            text: 'Take a photo',
            icon: 'camera',
            itemCallback: isGrantCameraPermission
              ? onPressPhoto
              : showPermissionCameraPopup,
          },
        ]}
      />
      <SelectBackground
        ref={selectBackgroundRef}
        optionsImage={[
          {
            text: 'Select from library',
            itemCallback: isGrantPhotoPermission
              ? onPressGalleryBackground
              : showPermissionPhotoPopup,
          },
          {
            text: 'Take photo',
            itemCallback: isGrantCameraPermission
              ? onPressPhotoBackground
              : showPermissionCameraPopup,
          },
        ]}
        onPressColor={onPressColor}
      />
      <BottomSheet
        isVisible={isVisibleBack}
        title={'Discard changes?'}
        description={
          'If you go back now, you will lose any changes you have made. Do you want to proceed?'
        }
        onClose={onClosePopupBack}
        onPressCancel={onClosePopupBack}
        onBackdropPress={onClosePopupBack}
        onPressSubmit={onBack}
        buttonCancelText={'Cancel'}
        buttonSubmitText={'Yes'}
      />
      <NftBottom
        ref={photoRef}
        onClose={onClosePermissionPhotoPopup}
        onPressCancel={onClosePermissionPhotoPopup}
        onPressSubmit={allowPhotoPermissions}
      />
      <NftBottom
        ref={cameraRef}
        onClose={onClosePermissionCameraPopup}
        onPressCancel={onClosePermissionCameraPopup}
        onPressSubmit={allowCameraPermissions}
      />
      <BottomInput
        ref={bottomInputRef}
        onChangeText={onChangeText}
        onChangeStyle={onChangeStyle}
        onClose={onCloseModal}
      />
      <BottomIcon
        ref={bottomIconRef}
        onChangeItem={onSelectIcon}
        onClose={onCloseModal}
      />
    </Screen>
  );
};
