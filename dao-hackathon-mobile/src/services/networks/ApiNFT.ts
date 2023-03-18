import { getAPI, handleResult } from '../ApiClient';

const mint = (payload: any) => handleResult(getAPI.post('nft/mint', payload));
const transfer = (payload: any) =>
  handleResult(getAPI.post('nft/transfer', payload));
const markDataOnImage = (payload: any) =>
  handleResult(getAPI.post('nft/mark-data-on-image', payload));
const getListNFT = (payload: any) =>
  handleResult(
    getAPI.get('nft/get-list-nft', {
      params: payload,
    }),
  );
const getListCardType = (payload: any) =>
  handleResult(
    getAPI.get('nft/get-list-card-type', {
      params: payload,
    }),
  );
const getEstimateFeeMint = (payload: any) =>
  handleResult(getAPI.post('nft/estimate-mint-fee', payload));
const getEstimateFeeTransfer = (payload: any) =>
  handleResult(getAPI.post('nft/estimate-transfer-fee', payload));
const deleteWallet = (payload: any) =>
  handleResult(getAPI.post('wallet/delete-wallet', payload));

export {
  mint as mintAPI,
  getListNFT,
  markDataOnImage,
  transfer,
  getListCardType,
  getEstimateFeeMint,
  getEstimateFeeTransfer,
  deleteWallet,
};
