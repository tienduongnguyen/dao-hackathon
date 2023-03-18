import { getAPI, handleResult } from '../ApiClient';

const getMintTransaction = (payload: any) =>
  handleResult(getAPI.post('nft/get-transaction-mint', payload));

const getTransferTransaction = (payload: any) =>
  handleResult(getAPI.post('nft/get-transaction-transfer', payload));

export { getMintTransaction, getTransferTransaction };
