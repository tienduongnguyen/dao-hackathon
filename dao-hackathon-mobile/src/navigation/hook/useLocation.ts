import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import isEqual from 'react-fast-compare';
import DeviceInfo from 'react-native-device-info';

import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import { usePrevious } from '@src/common';
import { getDeviceToken } from '@src/common/firebase/notification';
import { useReducer } from '@src/redux';
import { LocationUtils } from '@src/utils';

export const useLocation = () => {
  // state
  const { data, dataNetwork, dataName } = useReducer(x => x.Wallet) || {};
  const [isAddedLocation, setIsAddedLocation] = useState<boolean | null>(null);
  const dataAddress = useMemo(
    () =>
      data.map((item, index) => ({
        address: item,
        name: dataName[index],
        networkType: dataNetwork[index],
      })),
    [data, dataName, dataNetwork],
  );
  const docRefLocations = useMemo(
    () => firestore().collection('locations'),
    [],
  );

  const prevCoords = useRef<{
    longitude: number;
    latitude: number;
  } | null>();

  const dataAddressPrev = usePrevious(dataAddress);

  const isFocus = useIsFocused();

  // func
  const handleUpdateFirestore = useCallback(
    async (values: any) => {
      const token = await getDeviceToken();
      return docRefLocations.doc(token).update(values);
    },
    [docRefLocations],
  );

  // effect
  useEffect(() => {
    getDeviceToken().then(token => {
      docRefLocations
        .where('id', '==', token)
        .get()
        .then(querySnapshot => {
          if (querySnapshot?.docs?.[0]?.data()) {
            prevCoords.current = querySnapshot?.docs?.[0]?.data().location;
            setIsAddedLocation(true);
          } else {
            setIsAddedLocation(false);
          }
        });
    });
  }, [docRefLocations]);

  useEffect(() => {
    if (
      dataAddress?.length > 0 &&
      typeof isAddedLocation === 'boolean' &&
      !isAddedLocation
    ) {
      LocationUtils.getCurrentLocation().then(async coords => {
        const token = await getDeviceToken();
        const deviceName = await DeviceInfo.getDeviceName();

        console.log({ deviceName });

        prevCoords.current = coords;

        if (coords) {
          docRefLocations
            .doc(token)
            .set({
              id: token,
              location: new firestore.GeoPoint(
                coords.latitude,
                coords.longitude,
              ),
              wallets: dataAddress,
              isInShakeScreen: true,
              isShaking: false,
              deviceName,
            })
            .then(() => {
              console.log('User added!');
              setIsAddedLocation(true);
            })
            .catch(error => {
              console.log({ error });
            });
        }
      });
    }
  }, [docRefLocations, isAddedLocation, dataAddress]);

  const watchPosition = useCallback(() => {
    LocationUtils.getCurrentLocation().then(coords => {
      if (coords) {
        handleUpdateFirestore({
          location: new firestore.GeoPoint(coords.latitude, coords.longitude),
        })
          .then(() => {
            console.log('Update location!');
          })
          .catch(error => {
            console.log({ errorUpdateLocation: error });
          });
      }
    });
  }, [handleUpdateFirestore]);

  useEffect(() => {
    if (
      dataAddress?.length > 0 &&
      !isEqual(dataAddressPrev, dataAddress) &&
      typeof isAddedLocation === 'boolean' &&
      isAddedLocation
    ) {
      handleUpdateFirestore({
        wallets: dataAddress,
      })
        .then(() => {
          console.log('Update wallets!');
        })
        .catch(error => {
          console.log({ errorUpdateLocation: error });
        });
    }
  }, [
    dataAddress,
    isAddedLocation,
    dataAddressPrev,
    docRefLocations,
    handleUpdateFirestore,
  ]);

  const handleChangeAppStatus = useCallback(
    (nextAppState: AppStateStatus) => {
      if (typeof isAddedLocation === 'boolean' && isAddedLocation && isFocus) {
        if (nextAppState === 'active') {
          console.log('AppState', 'Active');

          watchPosition();

          handleUpdateFirestore({ isInShakeScreen: true })
            .then(() => {
              console.log('Update in shake screen!', true);
            })
            .catch(error => {
              console.log({ errorUpdateLocation: error });
            });
        } else {
          console.log('AppState', 'Non - Active');

          // intervalRef.current && clearInterval(intervalRef.current);
          handleUpdateFirestore({ isInShakeScreen: false })
            .then(() => {
              console.log('Update Update in shake screen', false);
            })
            .catch(error => {
              console.log({ errorUpdateLocation: error });
            });
        }
      }
    },
    [isAddedLocation, watchPosition, handleUpdateFirestore, isFocus],
  );

  useEffect(() => {
    AppState.addEventListener('change', handleChangeAppStatus);

    return () => {
      AppState.removeEventListener('change', () => {
        console.log('remove listener');
      });
    };
  }, [handleChangeAppStatus]);

  useEffect(() => {
    if (typeof isAddedLocation === 'boolean' && isAddedLocation) {
      handleUpdateFirestore({ isInShakeScreen: true })
        .then(() => {
          console.log('Update Update in shake screen', true);
        })
        .catch(error => {
          console.log({ errorUpdateLocation: error });
        });
    }
    return () => {
      if (typeof isAddedLocation === 'boolean' && isAddedLocation) {
        handleUpdateFirestore({ isInShakeScreen: false })
          .then(() => {
            console.log('Update Update in shake screen', false);
          })
          .catch(error => {
            console.log({ errorUpdateLocation: error });
          });
      }
    };
  }, [isAddedLocation, handleUpdateFirestore]);
};
