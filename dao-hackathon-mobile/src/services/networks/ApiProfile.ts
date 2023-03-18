import { getAPI, handleResult } from '../ApiClient';

const addEditProfile = (payload: any) =>
  handleResult(getAPI.post('notification/add-edit-profile', payload));
const getProfile = (payload: { mnemonic: string }) =>
  handleResult(getAPI.post('notification/get-profile', payload));
export { addEditProfile, getProfile };
