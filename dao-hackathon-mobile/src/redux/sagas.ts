import { getListNFT, getNotifications } from '@src/services';
import { Database } from '@src/utils';
import { SagaHelper } from '@src/utils/SagaHelper';

import { ACTION } from './actions';

const { GET_ADDRESS, GET_LIST_NFT, GET_HISTORY, GET_NOTIFICATION } = ACTION;
const NetworkSaga = [
  SagaHelper(GET_ADDRESS, Database.getAllAddress),
  SagaHelper(GET_HISTORY, Database.getAllTransaction),
  SagaHelper(GET_LIST_NFT, getListNFT),
  SagaHelper(GET_NOTIFICATION, getNotifications),
];

export default function* saga() {
  for (let i = 0; i < NetworkSaga.length; i++) {
    yield NetworkSaga[i];
  }
}
