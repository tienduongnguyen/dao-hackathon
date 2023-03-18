import AsyncStorage from '@react-native-community/async-storage';
import { NetworkType } from '@src/common';
import { STORAGE_KEY } from '@src/constants';
import { ACTION, actions } from '@src/redux';
const {
  INDEX_OF_WALLET,
  LISTADDRESS,
  LOGINTIME,
  MNEMONIC,
  PASSWORD,
  SELECT,
  NETWORK_TYPE,
} = STORAGE_KEY;
export const Database = {
  saveMnemonic: async (mnemonic: string) => {
    return await AsyncStorage.setItem(MNEMONIC, mnemonic);
  },
  getMnemonic: async () => {
    return await AsyncStorage.getItem(MNEMONIC);
  },
  clearMnemonic: async () => {
    const listAddressStr = await AsyncStorage.getItem(LISTADDRESS);
    let listAddress = [];
    if (listAddressStr) {
      listAddress = JSON.parse(listAddressStr).map((e: any) => e.address);
    }
    return await AsyncStorage.multiRemove([
      MNEMONIC,
      INDEX_OF_WALLET,
      LISTADDRESS,
      SELECT,
      PASSWORD,
      LOGINTIME,
      ...listAddress,
    ]);
  },
  importPrivateKey: async (
    address: string,
    privateKey: string,
    name: string,
    isFromMnemonic = true,
    networkType: string,
  ) => {
    const isDup = await AsyncStorage.getItem(address);
    if (isDup) {
      return false;
    }
    const index = (await AsyncStorage.getItem(INDEX_OF_WALLET)) || '-1';

    if (isFromMnemonic) {
      await AsyncStorage.setItem(INDEX_OF_WALLET, `${parseInt(index, 10) + 1}`);
    }
    const listAddressStr = await AsyncStorage.getItem(LISTADDRESS);
    let listAddress = [];
    if (listAddressStr) {
      listAddress = JSON.parse(listAddressStr);
    }
    listAddress.push({
      address,
      name,
      isFromMnemonic,
      index: isFromMnemonic ? parseInt(index, 10) + 1 : null,
      networkType,
    });
    await AsyncStorage.setItem(LISTADDRESS, JSON.stringify(listAddress));

    return await AsyncStorage.setItem(address, privateKey);
  },
  clearPrivateKey: async (address: string) => {
    const listAddressStr = await AsyncStorage.getItem(LISTADDRESS);
    const addressCurrentSelect = await AsyncStorage.getItem(SELECT);
    if (addressCurrentSelect === address) {
      throw new Error('Your wallet current in use');
    }
    let listAddress = [];
    if (listAddressStr) {
      listAddress = JSON.parse(listAddressStr);
    }
    if (listAddress.length === 0) {
      throw new Error('One wallet can be remove');
    }
    // if (isFromMnemonic) {
    //   const index = (await AsyncStorage.getItem(INDEX_OF_WALLET)) || '0';
    //   await AsyncStorage.setItem(INDEX_OF_WALLET, `${parseInt(index) - 1}`);
    // }
    listAddress = listAddress.filter((e: any) => e.address !== address);
    await AsyncStorage.setItem(LISTADDRESS, JSON.stringify(listAddress));
    await AsyncStorage.removeItem(address);
  },
  clearAllData: async () => {
    await AsyncStorage.clear();
  },
  getPrivateKey: async (address: string) => {
    return await AsyncStorage.getItem(address);
  },
  getAllAddress: async () => {
    const listAddressStr = await AsyncStorage.getItem(LISTADDRESS);
    let listAddress = [];
    if (listAddressStr) {
      listAddress = JSON.parse(listAddressStr);
    }
    return {
      data: listAddress,
    };
  },
  getIndexMnemonic: async () => {
    return await AsyncStorage.getItem(INDEX_OF_WALLET);
  },
  saveNetworkType: async (networkType: NetworkType) => {
    await actions(ACTION.SET_NETWORK_TYPE)({ networkType });
    return await AsyncStorage.setItem(NETWORK_TYPE, networkType);
  },
  getNetworkType: async () => {
    return await AsyncStorage.getItem(NETWORK_TYPE);
  },
  setSelectAddress: async (address: string, networkType: NetworkType) => {
    await AsyncStorage.setItem(NETWORK_TYPE, networkType);
    actions(ACTION.SET_NETWORK_TYPE)({ networkType });
    return await AsyncStorage.setItem(SELECT, address);
  },
  getSelectAddress: async () => {
    return await AsyncStorage.getItem(SELECT);
  },
  addTransaction: async (address: string, payload: any) => {
    let list: any = await AsyncStorage.getItem(`${address}_transaction`);
    if (list) {
      list = JSON.parse(list);
    } else {
      list = [];
    }
    list.concat(payload);
    await AsyncStorage.setItem(`${address}_transaction`, JSON.stringify(list));
  },
  getAllTransaction: async (address: string) => {
    const list = await AsyncStorage.getItem(`${address}_transaction`);
    if (list) {
      return {
        data: JSON.parse(list),
      };
    }
    return {
      data: [],
    };
  },
  savePassword: async (password: string) => {
    await AsyncStorage.setItem(PASSWORD, password);
  },
  checkPassword: async (password: string) => {
    return (await AsyncStorage.getItem(PASSWORD)) === password;
  },
  setLoginTime: async () => {
    await AsyncStorage.setItem(LOGINTIME, `${Date.now()}`);
  },
  isExpired: async () => {
    const TIME_EXPIRED = 1000 * 60 * 15; // 15 minutes
    const loginTime = await AsyncStorage.getItem(LOGINTIME);
    if (!loginTime) {
      return null;
    }
    const time = parseInt(loginTime, 10);
    const now = Date.now();
    const diff = now - time;
    if (diff > TIME_EXPIRED) {
      return true;
    }
    return false;
  },
  renameWallet: async (privateKey: string, name: string) => {
    const listAddressStr = await AsyncStorage.getItem(LISTADDRESS);
    let listWallet = [];
    if (listAddressStr) {
      listWallet = JSON.parse(listAddressStr);
    }
    const newListWallet = listWallet.map((obj: { address: string }) => {
      if (obj.address === privateKey) {
        return { ...obj, name: name };
      }
      return obj;
    });
    await AsyncStorage.setItem(LISTADDRESS, JSON.stringify(newListWallet));
  },
};
