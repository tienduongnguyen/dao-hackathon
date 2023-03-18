import { getAPI, handleResult } from '../ApiClient';

const generateMnemonic = () =>
  handleResult(getAPI.get('wallet/generate-mnemonic'));

const generateAddress = (payload: any, headers: any) =>
  handleResult(
    getAPI.post('wallet/generate-address', undefined, {
      headers: headers,
      params: payload,
    }),
  );
const requestSolana = (payload: any) =>
  handleResult(
    getAPI.get('wallet/request-sol', {
      params: payload,
    }),
    false,
  );
const privateKeyToAddress = (payload: any, headers: any) =>
  handleResult(
    getAPI.get('wallet/private-key-to-address', {
      headers: headers,
      params: payload,
    }),
    false,
  );
const checkValidMnemonic = (payload: any) =>
  handleResult(
    getAPI.get('wallet/check-valid-mnemonic', {
      params: payload,
    }),
  );

const checkValidAddress = (payload: any, headers: any) =>
  handleResult(
    getAPI.get('wallet/check-valid-address', {
      params: payload,
      headers,
    }),
  );
const getBalance = (payload: any, headers: any) =>
  handleResult(
    getAPI.post('wallet/get-balance', undefined, { headers, params: payload }),
    false,
  );

export {
  generateMnemonic,
  generateAddress,
  checkValidMnemonic,
  getBalance,
  checkValidAddress,
  privateKeyToAddress,
  requestSolana,
};
