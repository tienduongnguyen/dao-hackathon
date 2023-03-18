import { getAPI, handleResult } from '../ApiClient';

const read = (payload: any) =>
  handleResult(
    getAPI.get('storage/read', {
      params: payload,
    }),
  );
const uploadImage = (payload: any) =>
  handleResult(getAPI.post('storage/upload-image', payload));

const uploadJson = (payload: any) =>
  handleResult(getAPI.post('storage/upload-json', payload));
export { read, uploadImage, uploadJson };
