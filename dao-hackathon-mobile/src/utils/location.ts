// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid, Platform } from 'react-native';

import GeoLocation from 'react-native-geolocation-service';

// eslint-disable-next-line no-shadow
enum PermissionType {
  GRANTED = 'granted',
  DENIED = 'denied',
  DISABLED = 'disabled',
  RETRICTED = 'restricted',
}

export class LocationUtils {
  static watchID: number | null;

  static async requestPermission() {
    if (Platform.OS === 'ios') {
      const hasPermission = await this.requestPermissionIOS();
      return hasPermission;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    return false;
  }

  static async requestPermissionIOS() {
    const status = await GeoLocation.requestAuthorization('whenInUse');

    if (status === PermissionType.GRANTED) {
      return true;
    }

    return false;
  }

  static async getCurrentLocation(cb?: () => void): Promise<{
    longitude: number;
    latitude: number;
  } | null> {
    const hasPermission = await this.requestPermission();

    if (!hasPermission) {
      cb?.();
      return null;
    }

    return new Promise((resolve, reject) => {
      GeoLocation.getCurrentPosition(
        position => {
          const { coords } = position || {};
          const { longitude, latitude } = coords || {};
          resolve({ longitude, latitude });
        },
        error => {
          reject(error.message);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          distanceFilter: 0,
          forceRequestLocation: true,
          forceLocationManager: true,
          showLocationDialog: true,
        },
      );
    });
  }

  static watchPosition(
    successCallback: GeoLocation.SuccessCallback,
    errorCallback?: GeoLocation.ErrorCallback,
  ) {
    const options: GeoLocation.GeoWatchOptions = {
      accuracy: {
        android: 'balanced',
        ios: 'best',
      },
      enableHighAccuracy: true,
      distanceFilter: 0,
      forceRequestLocation: true,
      forceLocationManager: true,
      showLocationDialog: true,
    };

    const id = GeoLocation.watchPosition(
      successCallback,
      errorCallback,
      options,
    );

    this.watchID = id;
  }

  static clearWatch() {
    console.log({ clear: this.watchID });

    if (this.watchID) {
      GeoLocation.clearWatch(this.watchID);
    }

    this.watchID = null;
  }
}
