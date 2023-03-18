import { getAPI, handleResult } from '../ApiClient';

const addAccount = (payload: any, headers: any) =>
  handleResult(
    getAPI.post('notification/add-account', payload, {
      headers: headers,
    }),
  );

const deleteAccount = (payload: any, headers: any) =>
  handleResult(
    getAPI.post('notification/delete-account', payload, {
      headers: headers,
    }),
  );

const changeStatusNotification = (payload: any, headers: any) =>
  handleResult(
    getAPI.post('notification/change-status-notification', payload, {
      headers: headers,
    }),
  );

const getNotifications = (
  payload: { tokenFCM: string; status: boolean; offset: number },
  headers: any,
) =>
  handleResult(
    getAPI.post('notification/get-all-notification', payload, {
      headers: headers,
    }),
  );

const getNotificationDetail = (
  payload: { id: string; tokenFCM: string },
  headers: any,
) =>
  handleResult(
    getAPI.post('notification/seen-notification', payload, {
      headers: headers,
    }),
  );

export {
  addAccount,
  deleteAccount,
  changeStatusNotification,
  getNotifications,
  getNotificationDetail,
};
