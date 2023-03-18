import AsyncStorage from '@react-native-community/async-storage';
import { ASYNC_STORAGE, BASE_URL, STORAGE_KEY } from '@src/constants';
import { showMessages } from '@src/utils';
import axios, { AxiosResponse } from 'axios';
const createAPI = () => {
  const APIInstant = axios.create();
  APIInstant.defaults.baseURL = BASE_URL;
  APIInstant.defaults.timeout = 100000;
  APIInstant.interceptors.request.use(
    async config => {
      const user_id = await AsyncStorage.getItem(ASYNC_STORAGE.USER_ID);
      const address = await AsyncStorage.getItem(STORAGE_KEY.SELECT);
      const network_type = await AsyncStorage.getItem(STORAGE_KEY.NETWORK_TYPE);
      if (user_id) {
        config.headers.user_id = user_id;
      }
      if (address) {
        config.headers.address = address;
      }
      if (!config.headers['network-type'] && network_type) {
        config.headers['network-type'] = network_type;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    },
  );

  APIInstant.interceptors.response.use(response => {
    return response;
  });
  return APIInstant;
};

const getAPI = createAPI();

const handleResult = (api: Promise<AxiosResponse>, isShowMessageError = true) =>
{
  return   api
  .then(res => {
    if (res.data.status !== 1) {
      let msg = res.data.message;
      if (msg === 'Invalid public key input') {
        msg = 'Please input a valid address';
      } else if (
        msg ===
        'failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit.'
      ) {
        msg =
          'Cannot Transfer NFT. Your balance is not enough to pay for the transaction.';
      }

      return Promise.reject(res.data.message);
    }
    return Promise.resolve(res.data);
  })
  .catch(err => {
    console.log(err);
    if (err.message === 'Network Error' && isShowMessageError) {
      showMessages('Oops, looks like a network error has occurred', '');
    }
  });
}

export { getAPI, handleResult };
