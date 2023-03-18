import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { getDeviceToken } from '@src/common/firebase/notification';
import { NftBottom } from '@src/library/components';
import { Shake, WalletListType } from '@src/model/shake';
import { LocationUtils } from '@src/utils';

import {
  getDistanceFromLatLonInMeter,
  isIos,
} from '../../../../../common/method/index';
import { GetNearestLocationAccountType } from '../type';

const SPEED_SHAKE = isIos ? 40 : 200;

export const useShake = () => {
  // state
  const docLocationRef = useMemo(() => firestore().collection('locations'), []);
  const isShaking = useRef(false);
  const nftBottomRef = useRef<NftBottom>();
  const [wallets, setWallets] = useState<Array<WalletListType>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const shakeLastUpdateValue = useRef<number>(0);
  const shakeLastXValue = useRef<number>(0);
  const shakeLastYValue = useRef<number>(0);
  const shakeLastZValue = useRef<number>(0);
  const docRefLocations = useMemo(
    () => firestore().collection('locations'),
    [],
  );
  // eslint-disable-next-line no-undef
  const timeoutShaking = useRef<NodeJS.Timeout | null>(null);

  // func
  const handleSetStatusShake = useCallback(() => {
    nftBottomRef.current?.show(
      false,
      'Mesme needs permission to use your location. This allows you to match and transfer NFTs to people.',
    );
  }, [nftBottomRef]);

  const handleUpdateFirestore = useCallback(
    async (values: any) => {
      const token = await getDeviceToken();
      return docRefLocations.doc(token).update(values);
    },
    [docRefLocations],
  );

  const getNearestLocationAccount = useCallback(
    async ({
      currentLocation,
      distance = 10,
    }: GetNearestLocationAccountType) => {
      console.log('Get Near device');

      const token = await getDeviceToken();

      const query = docLocationRef
        .where('isInShakeScreen', '==', true)
        .where('isShaking', '==', true);

      query
        .get()
        .then(
          (
            querySnapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
          ) => {
            const walletsValue = querySnapshot.docs
              ?.map(
                (
                  doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData>,
                ) => doc.data() as Shake,
              )
              .filter(el => {
                return (
                  getDistanceFromLatLonInMeter({
                    lat1: currentLocation.latitude,
                    lon1: currentLocation.longitude,
                    lat2: el.location.latitude,
                    lon2: el.location.longitude,
                  }) <= distance && el.id !== token
                );
              })
              .map((item, index) => {
                console.log(item);

                return {
                  title: item?.deviceName || `Device ${index + 1} name`,
                  wallets: item.wallets,
                };
              });

            isShaking.current = false;
            setIsLoading(false);

            setWallets(walletsValue);
          },
        )
        .catch(() => {
          setIsLoading(false);
          isShaking.current = false;
        });
    },
    [docLocationRef],
  );

  const handleShake = () => {
    // Shake
    console.log({ isShaking: isShaking.current });
    if (isShaking.current) {
      console.log('cancel Shake');
      return;
    }
    setIsLoading(true);
    isShaking.current = true;
    console.log('Is Shaking');

    LocationUtils.getCurrentLocation(handleSetStatusShake).then(coords => {
      if (coords) {
        if (timeoutShaking.current) {
          clearTimeout(timeoutShaking.current);
        }

        timeoutShaking.current = setTimeout(() => {
          handleUpdateFirestore({
            location: new firestore.GeoPoint(coords.latitude, coords.longitude),
            isShaking: false,
          })
            .then(() => {
              console.log('Remove is Shaking');
            })
            .catch(error => {
              console.log({ errorUpdateLocation: error });
            });
        }, 3000);

        handleUpdateFirestore({
          location: new firestore.GeoPoint(coords.latitude, coords.longitude),
          isShaking: true,
        })
          .then(() => {
            console.log('Update location when shake !');
            getNearestLocationAccount({ currentLocation: coords });
          })
          .catch(error => {
            console.log({ errorUpdateLocation: error });
          });
      }
    });
  };

  //effect
  useEffect(() => {
    (async () => {
      const isPermission = await LocationUtils.requestPermission();

      if (!isPermission) {
        nftBottomRef.current?.show(
          false,
          'Mesme needs permission to user your location. This allows you to match and transfer NFTs to people',
        );
      }
    })();
  }, []);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 800);
    const subscription = accelerometer.subscribe(
      ({ x, y, z }) => {
        const currTime = Date.now();

        if (currTime - shakeLastUpdateValue.current > 100) {
          const diffTime = currTime - shakeLastUpdateValue.current;
          shakeLastUpdateValue.current = currTime;
          const speed =
            (Math.abs(
              x +
                y +
                z -
                shakeLastXValue.current -
                shakeLastYValue.current -
                shakeLastZValue.current,
            ) /
              diffTime) *
            10000;

          if (speed > SPEED_SHAKE) {
            shakeLastXValue.current = x;
            shakeLastYValue.current = y;
            shakeLastZValue.current = z;

            handleShake();
          }
        }
      },
      err => {
        console.log(err);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { wallets, nftBottomRef, isShaking, isLoading, setIsLoading };
};
