/* eslint-disable no-useless-escape */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Linking,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RESULTS } from 'react-native-permissions';

import { ScreenComponent, WInput } from '@components-old';
import { useIsFocused } from '@react-navigation/native';
import R from '@src/assets/R';
import {
  DEFAULT_PER_PAGE,
  hiddenModalPickImage,
  showModalPickImage,
  sizeScale,
  useCameraPermission,
  usePhotoPermission,
} from '@src/common';
import WView from '@src/components/WView';
import { dimension } from '@src/constants';
import {
  Block,
  Button,
  Spacer,
  Text,
  TwoColorText,
} from '@src/library/components';
import BottomSheet from '@src/library/components/bottom-sheet';
import { NftBottom } from '@src/library/components/nft-bottom-sheet';
import { SelectAction } from '@src/library/components/select-action';
import { navigate } from '@src/navigation/navigation-service';
import { AUTHORIZE_STACK } from '@src/navigation/screen-types';
import { ACTION, actions, useReducer } from '@src/redux';
import {
  getEstimateFeeMint,
  getListCardType,
  getMintTransaction,
  markDataOnImage,
  mintAPI,
  uploadJson,
} from '@src/services';
import { useTheme } from '@src/themes';
import {
  callAPIHook,
  Database,
  lengthInUtf8Bytes,
  showMessages,
  takeFromCamera,
} from '@src/utils';

import ItemCardType from '../../components/ItemCardType';
import { useStackStyle } from '../style';

const MintNftManualScreen = () => {
  //state
  const [company_name, setCompany_name] = useState('');
  const [company_address, setCompany_address] = useState('');
  const [full_name, setFull_name] = useState('');
  const [other_name, setOther_name] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [company_website, setCompany_website] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [image, setImage] = useState('');
  const [maxLengthName, setMaxLengthName] = useState(32);
  const [isLoading, setLoading] = useState(false);
  const [listType, setListType] = useState([]);
  const [card_type, setCard_type] = useState(0);
  const addressReducer = useReducer(x => x.Wallet);
  const [fee, setFee] = useState(0);
  const [isShowPopupMint, setIsShowPopupMint] = useState(false);
  const [description, setDescription] = useState('');
  const { balance } = addressReducer;
  const { colors } = useTheme();
  const [fullNameChanged, setFullNameChanged] = useState(false);
  const [otherNameChanged, setOtherNameChanged] = useState(false);
  const [companyNameChanged, setCompanyNameChanged] = useState(false);
  const [companyAddressChanged, setCompanyAddressChanged] = useState(false);
  const [positionChanged, setPositionChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [websiteChanged, setWebsiteChanged] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [isGrantCameraPermission, setIsGrantCameraPermission] = useState(true);
  const networkType = useReducer(x => x.App.networkType);
  const [jsonUri, setJsonUri] = useState<Array<string>>([]);
  const address = addressReducer.data[addressReducer.select];
  const listCardTypeRef = useRef<FlatList>(null);
  const [statusCamera] = useCameraPermission();
  const [statusPhoto] = usePhotoPermission();

  const { styles } = useStackStyle();
  const selectRef = useRef<SelectAction>();
  const nftBottomRef = useRef<NftBottom>();

  const isValidEmail = String(email.trim())
    .toLowerCase()
    .match(
      '^[a-zA-Z0-9]+([%\\^&\\-\\=\\+\\,\\.]?[a-zA-Z0-9]+)@[a-zA-Z]+([\\.]?[a-zA-Z]+)*(\\.[a-zA-Z]{2,3})+$',
    );

  const isValidPhone =
    String(phone_number.trim())
      .toLowerCase()
      .match(
        /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d+)\)?)[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i,
      ) &&
    phone_number.trim().length >= 7 &&
    phone_number.trim().length <= 15;

  const isValidWebsite =
    String(company_website.trim())
      .toLowerCase()
      .match(
        '^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}.(xn--)?([a-z0-9-]{1,61}|[a-z0-9-]{1,30}.[a-z]{2,})$',
      ) && company_website.trim().length >= 3;

  const isValidFullName = useMemo(() => {
    if (!fullNameChanged) {
      return true;
    }
    return full_name.trim().length > 0;
  }, [fullNameChanged, full_name]);

  const isValidOtherName = useMemo(() => {
    if (!otherNameChanged) {
      return true;
    }
    return other_name.trim().length > 0;
  }, [otherNameChanged, other_name]);

  const isValidCompanyName = useMemo(() => {
    if (!companyNameChanged) {
      return true;
    }
    return company_name.trim().length > 0;
  }, [companyNameChanged, company_name]);

  const isValidCompanyAddress = useMemo(() => {
    if (!companyAddressChanged) {
      return true;
    }
    return company_address.trim().length > 0;
  }, [companyAddressChanged, company_address]);

  const isValidPosition = useMemo(() => {
    if (!positionChanged) {
      return true;
    }
    return position.trim().length > 0;
  }, [position, positionChanged]);

  const isValidEmailChanged = useMemo(() => {
    if (!emailChanged) {
      return true;
    }
    return email.trim().length > 0 && isValidEmail;
  }, [email, emailChanged, isValidEmail]);

  const isValidWebsiteChanged = useMemo(() => {
    if (!websiteChanged) {
      return true;
    }
    return company_website.trim().length > 0 && isValidWebsite;
  }, [company_website, isValidWebsite, websiteChanged]);

  const isValidPhoneChanged = useMemo(() => {
    if (!phoneChanged) {
      return true;
    }
    return phone_number.trim().length > 0 && isValidPhone;
  }, [isValidPhone, phoneChanged, phone_number]);

  const isValid =
    full_name.trim().length > 0 &&
    other_name.trim().length > 0 &&
    company_name.trim().length > 0 &&
    company_address.trim().length > 0 &&
    company_website.trim().length > 0 &&
    email.trim().length > 0 &&
    phone_number.trim().length > 0 &&
    position.trim().length > 0 &&
    image.length > 0 &&
    isValidEmail &&
    isValidWebsite &&
    isValidPhone;

  //func
  const getFee = async (uri: any) => {
    const privateKey = await Database.getPrivateKey(address);

    callAPIHook({
      API: getEstimateFeeMint,
      payload: {
        privateKey,
        address,
        uri: uri,
      },
      setLoading: setLoading,
      onSuccess: res => {
        setFee(res.data);
        setIsShowPopupMint(true);
      },
    });
  };

  const closePopupMint = () => {
    setIsShowPopupMint(false);
  };

  const showPopup = async () => {
    const idxEnd = image.split('.').pop()?.indexOf('?key=');
    const imageExt = image.split('.').pop()?.substring(0, idxEnd);
    const imageProcessed = await callAPIHook({
      API: markDataOnImage,
      setLoading: setLoading,
      formdata: {
        image: {
          name: 'images',
          type: 'image/' + imageExt,
          filename: 'image.png',
          uri: image,
        },
        card_type,
        company_name,
        company_address,
        company_website,
        full_name,
        other_name,
        position,
        email,
        phone_number,
      },
    });
    const imageUri = imageProcessed.data;

    const metadata = [
      {
        name: full_name.trim(),
        symbol: 'MESME',
        description: description.trim(),
        edition: '2022',
        external_url: '',
        create_date: Date.now(),
        attributes: [
          {
            trait_type: 'Company Name',
            value: company_name.trim(),
          },
          {
            trait_type: 'Other Name',
            value: other_name.trim(),
          },
          {
            trait_type: 'Company Address',
            value: company_address.trim(),
          },
          {
            trait_type: 'Full Name',
            value: full_name.trim(),
          },
          {
            trait_type: 'Position',
            value: position.trim(),
          },
          {
            trait_type: 'Email',
            value: email.trim(),
          },
          {
            trait_type: 'Company Website',
            value: company_website.trim(),
          },
          {
            trait_type: 'Phone Number',
            value: phone_number.trim(),
          },
        ],
        properties: {
          files: [
            {
              uri: imageUri,
              type: 'image/png',
            },
          ],
          category: 'image',
          creators: [
            {
              address: address,
              share: 100,
            },
          ],
        },
        image: imageUri,
      },
    ];
    callAPIHook({
      API: uploadJson,
      setLoading: setLoading,
      payload: metadata,
      onSuccess: res => {
        getFee(res.data);
        setJsonUri(res.data);
      },
    });
  };

  const onCallbackSelectImage = useCallback(
    (res: any) => {
      // imagePicker(res => {
      const uri = typeof res === 'string' ? res : res[0];
      hiddenModalPickImage();
      closePopupSelectImage();
      setImage(uri);
      if (!image) {
        setTimeout(() => {
          if (Platform.OS === 'android') {
            setImage(uri + '?key=' + Date.now());
          } else {
            setImage(uri);
          }
        }, 100);
      }
      // }, image);
    },
    [image],
  );
  const showPermissionPopup = (isPhoto: boolean) => {
    selectRef.current?.hide();
    setTimeout(() => {
      nftBottomRef.current?.show(isPhoto);
    }, 300);
  };

  const onSelectFromGallery = useCallback(() => {
    showModalPickImage({
      onHeaderRight: onCallbackSelectImage,
      isShowHeader: true,
      maxSelect: 1,
    });
  }, [onCallbackSelectImage]);

  const onTakeNewPhoto = useCallback(() => {
    takeFromCamera(onCallbackSelectImage);
  }, [onCallbackSelectImage]);

  const closePopupSelectImage = () => {
    selectRef.current?.hide();
  };

  const showPopupSelectImage = () => {
    Keyboard.dismiss();
    selectRef.current?.show();
  };

  const getDataMint = () => {
    callAPIHook({
      API: getMintTransaction,
      payload: {
        address,
        offset: 0,
      },
      onSuccess: res => {
        if (res) {
          actions(ACTION.SET_HISTORY_MINT)({
            data: res.data,
            firstPage: true,
          });
          if (res.data.length < DEFAULT_PER_PAGE) {
            actions(ACTION.SET_MINT_LOAD_MORE)(false);
          } else {
            actions(ACTION.SET_PAGE_MINT)(true);
            actions(ACTION.SET_MINT_LOAD_MORE)(true);
          }
        }
      },
    });
  };

  const onPressMintNFT = async () => {
    if (balance < fee) {
      return showMessages(
        '',
        'Cannot Mint NFT. Your balance is not enough to pay for the transaction.',
      );
    }
    closePopupMint();
    const privateKey = await Database.getPrivateKey(address);

    callAPIHook({
      API: mintAPI,
      setLoading: setLoading,
      payload: {
        privateKey,
        address,
        uri: jsonUri,
      },
      onSuccess: res => {
        if (res) {
          getDataMint();
          navigate(AUTHORIZE_STACK.SUCCESS, {
            type: 'mint',
          });
        }
      },
    });
  };
  const onPressPreview = async () => {
    const imgExt = image.split('.').pop();

    const idxEnd = imgExt?.indexOf('?key=');
    const imageExt = idxEnd === -1 ? imgExt : imgExt?.substring(0, idxEnd);
    const imageProcessed = await callAPIHook({
      API: markDataOnImage,
      setLoading: setLoading,
      formdata: {
        image: {
          name: 'images',
          type: 'image/' + imageExt,
          filename: 'image.png',
          uri: image,
        },
        card_type,
        company_name,
        company_address,
        company_website,
        full_name,
        other_name,
        position,
        email,
        phone_number,
      },
    });
    const imageUri = imageProcessed.data;
    const metadata = {
      name: full_name.trim(),
      description: description.trim(),
      attributes: [
        {
          trait_type: 'Company Name',
          value: company_name.trim(),
        },
        {
          trait_type: 'Company Address',
          value: company_address.trim(),
        },
        {
          trait_type: 'Full Name',
          value: full_name.trim(),
        },
        {
          trait_type: 'Other Name',
          value: other_name.trim(),
        },
        {
          trait_type: 'Position',
          value: position.trim(),
        },
        {
          trait_type: 'Email',
          value: email.trim(),
        },
        {
          trait_type: 'Company Website',
          value: company_website.trim(),
        },
        {
          trait_type: 'Phone Number',
          value: phone_number.trim(),
        },
      ],
      image: imageUri,
    };
    navigate(AUTHORIZE_STACK.PREVIEW_SCREEN, {
      metadata,
    });
  };

  const getAllType = () => {
    callAPIHook({
      API: getListCardType,
      setLoading: setLoading,
      onSuccess: res => {
        setListType(
          res.data.map((e: any) => ({
            metadata: { image: e.img },
            mint: e.id,
            data: {
              name: e.name,
            },
          })),
        );
      },
    });
  };

  const onChangeTextFullName = (text: string) => {
    if (lengthInUtf8Bytes(text) >= 32) {
      setMaxLengthName(text.length > 32 ? 32 : text.length);
    }
    setFull_name(text);
    setFullNameChanged(true);
  };

  const onChangeTextOtherName = (text: string) => {
    setOther_name(text);
    setOtherNameChanged(true);
  };

  const onChangeTextCompanyName = (text: string) => {
    setCompany_name(text);
    setCompanyNameChanged(true);
  };

  const onChangeTextCompanyAddress = (text: string) => {
    setCompany_address(text);
    setCompanyAddressChanged(true);
  };

  const onChangeTextPosition = (text: string) => {
    setPosition(text);
    setPositionChanged(true);
  };
  const onChangeTextEmail = (text: string) => {
    setEmail(text);
    setEmailChanged(true);
  };
  const onChangeTextPhone = (text: string) => {
    setPhone_number(text);
    setPhoneChanged(true);
  };
  const onChangeTextWebsite = (text: string) => {
    setCompany_website(text);
    setWebsiteChanged(true);
  };

  const requestCameraPermission = async () => {
    if (statusCamera !== RESULTS.GRANTED) {
      Linking.openSettings();
      setIsGrantCameraPermission(false);
    }
    if (statusCamera === RESULTS.GRANTED) {
      setIsGrantCameraPermission(true);
    }
    if (statusCamera === RESULTS.BLOCKED) {
      Linking.openSettings();
    }
  };

  const checkCameraPermission = async () => {
    if (statusCamera === RESULTS.GRANTED) {
      setIsGrantCameraPermission(true);
    } else {
      setIsGrantCameraPermission(false);
    }
  };
  const [isGrantPhotoPermission, setIsGrantPhotoPermission] =
    useState<boolean>(true);
  const requestPhotoPermission = async () => {
    if (statusPhoto !== RESULTS.GRANTED) {
      Linking.openSettings();
      setIsGrantPhotoPermission(false);
    }
    if (statusPhoto === RESULTS.GRANTED) {
      setIsGrantPhotoPermission(true);
    }
    if (statusPhoto === RESULTS.BLOCKED) {
      Linking.openSettings();
    }
  };

  const checkPhotoPermission = async () => {
    if (statusPhoto === RESULTS.GRANTED) {
      setIsGrantPhotoPermission(true);
    } else {
      setIsGrantPhotoPermission(false);
    }
  };

  const allowCameraPermissions = () => {
    nftBottomRef.current?.hide();
    setTimeout(() => {
      requestCameraPermission();
      requestPhotoPermission();
    }, 300);
  };

  const onClosePermissionPopup = () => {
    nftBottomRef.current?.hide();
    setTimeout(() => {
      selectRef.current?.show();
    }, 300);
  };

  useEffect(() => {
    getAllType();
  }, []);
  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      checkCameraPermission();
      checkPhotoPermission();
    }
  }, [isFocus]);

  //render
  return (
    <ScreenComponent
      dialogLoading={isLoading}
      rightComponent={<></>}
      back
      titleHeader="Input"
      children={
        <>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.nftManualContent}
            style={styles.nftManualScroll}
            extraHeight={dimension.height * 0.15}
          >
            <TouchableOpacity
              style={styles.nftManualButton}
              onPress={showPopupSelectImage}
            >
              {image ? (
                <Image
                  style={styles.nftManualImage}
                  source={{
                    uri: image,
                  }}
                  resizeMode="contain"
                />
              ) : (
                <React.Fragment>
                  <Image
                    style={[styles.nftManualImageIcon]}
                    source={R.images.ic_camera}
                    resizeMode="contain"
                  />
                  <Spacer height={16} />
                  <Text
                    text={'Upload logo*'}
                    preset={'notoSanBody1Regular'}
                    colorTheme={'text2'}
                  />
                </React.Fragment>
              )}
            </TouchableOpacity>
            <Spacer height={24} />
            <FlatList
              ref={listCardTypeRef}
              data={listType}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={props => (
                <ItemCardType
                  idSelect={card_type}
                  onPress={item => {
                    if (listCardTypeRef.current) {
                      listCardTypeRef.current.scrollToIndex({
                        index: props.index,
                        animated: true,
                      });
                    }
                    setCard_type(item);
                  }}
                  {...props}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <WInput
              maxLength={maxLengthName}
              isError={!isValidFullName}
              containerStyle={styles.nftManualTextInput}
              value={full_name}
              placeholder="Enter your full name *"
              errorMessage={'This field is required'}
              onChangeText={onChangeTextFullName}
            />
            <WInput
              containerStyle={styles.nftManualTextInput}
              isError={!isValidOtherName}
              value={other_name}
              placeholder="Enter your other name *"
              errorMessage={'This field is required'}
              onChangeText={onChangeTextOtherName}
            />
            <WInput
              containerStyle={styles.nftManualTextInput}
              isError={!isValidCompanyName}
              value={company_name}
              placeholder="Enter your company name *"
              onChangeText={onChangeTextCompanyName}
              errorMessage={'This field is required'}
            />
            <WInput
              containerStyle={styles.nftManualTextInput}
              isError={!isValidCompanyAddress}
              value={company_address}
              placeholder="Enter your company address *"
              onChangeText={onChangeTextCompanyAddress}
              errorMessage={'This field is required'}
            />
            <WInput
              containerStyle={styles.nftManualTextInput}
              isError={!isValidPosition}
              value={position}
              placeholder="Enter your position *"
              onChangeText={onChangeTextPosition}
              errorMessage={'This field is required'}
            />
            <WInput
              containerStyle={styles.nftManualTextInput}
              value={email}
              placeholder="Enter your email *"
              isError={!isValidEmailChanged}
              errorMessage={
                !email ? 'This field is required' : 'Please input a valid email'
              }
              onChangeText={onChangeTextEmail}
            />
            <WInput
              containerStyle={styles.nftManualTextInput}
              value={company_website}
              placeholder="Enter your website *"
              isError={!isValidWebsiteChanged}
              maxLength={256}
              errorMessage={
                !company_website
                  ? 'This field is required'
                  : 'Please input a valid website'
              }
              onChangeText={onChangeTextWebsite}
            />
            <WInput
              containerStyle={styles.nftManualTextInput}
              value={phone_number}
              keyboardType="phone-pad"
              maxLength={15}
              placeholder="Enter your phone number *"
              onChangeText={onChangeTextPhone}
              isError={!isValidPhoneChanged}
              errorMessage={
                !phone_number
                  ? 'This field is required'
                  : 'Please input a valid phone number'
              }
            />
            <WInput
              value={description}
              maxLength={4000}
              containerStyle={styles.nftManualInput}
              note
              placeholder="Description (Optional)"
              onChangeText={setDescription}
            />
          </KeyboardAwareScrollView>
          <WView
            style={styles.nftManualBox2}
            flexDirection="row"
            paddingHorizontal={sizeScale(16)}
            backgroundColor={colors.background}
            marginTop={sizeScale(15)}
            padding={sizeScale(20)}
          >
            <Block block>
              <Button
                disabled={!isValid}
                onPress={onPressPreview}
                text={'Preview'}
                preset={'outline'}
                typePreset={'medium'}
                textColorTheme={'white'}
                borderColorTheme={'white'}
                buttonColorTheme={'background'}
              />
            </Block>
            <Spacer width={9} />
            <Block block>
              <Button
                disabled={!isValid}
                onPress={showPopup}
                text={'Mint'}
                gradient={colors.gradient}
                preset={'outline'}
                typePreset={'medium'}
                textColorTheme={'white'}
              />
            </Block>
          </WView>
          <BottomSheet
            isVisible={isShowPopupMint}
            title={'Confirm and Pay'}
            description={TwoColorText({
              firstText: 'You will need to pay ',
              fee: `${fee} ${
                networkType === 'bsc' ? 'BNB' : networkType.toUpperCase()
              }`,
              lastText: ' to Mint an NFT. Do you want to proceed?',
            })}
            onClose={closePopupMint}
            onPressCancel={closePopupMint}
            onPressSubmit={onPressMintNFT}
            buttonCancelText={'Cancel'}
            buttonSubmitText={'Yes'}
          />
          <SelectAction
            ref={selectRef}
            option={[
              {
                text: 'Select photo from Camera roll',
                icon: 'gallery',
                itemCallback: isGrantPhotoPermission
                  ? onSelectFromGallery
                  : () => {
                      showPermissionPopup(true);
                    },
              },
              {
                text: 'Take a photo',
                icon: 'camera',
                itemCallback: isGrantCameraPermission
                  ? onTakeNewPhoto
                  : () => {
                      showPermissionPopup(false);
                    },
              },
            ]}
          />
          <NftBottom
            ref={nftBottomRef}
            onClose={onClosePermissionPopup}
            onPressCancel={onClosePermissionPopup}
            onPressSubmit={allowCameraPermissions}
          />
        </>
      }
    />
  );
};
export default MintNftManualScreen;
