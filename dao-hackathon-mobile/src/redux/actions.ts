/* eslint-disable @typescript-eslint/no-var-requires */
const ACTION = {
  RESET: 'reset',
  CANCEL: 'cancel',
  GET_ADDRESS: 'get_address',
  SELECT_ADDRESS: 'select_address',
  SELECT_ADDRESS_KEY: 'select_address_KEY',
  GET_LIST_NFT: 'get_list_nft',
  SET_BALANCE: 'set_balance',
  GET_HISTORY: 'get_history',
  SET_HISTORY_TRANSFER: 'set_history_transfer',
  SET_HISTORY_MINT: 'set_history_mint',
  SET_PAGE_MINT: 'set_page_mint',
  SET_PAGE_TRANSFER: 'set_page_transfer',
  SET_MINT_LOAD_MORE: 'set_mint_load_more',
  SET_TRANSFER_LOAD_MORE: 'set_transfer_load_more',
  SET_CURRENT_RECEIVE: 'set_current_receive',
  SCREEN_NAVIGATION: 'screen_navigation',
  SET_NETWORK_TYPE: 'set_network_type',
  SET_APP_EXPIRED: 'set_app_expired',
  SET_NOTIFICATION: 'set_notification',
  GET_NOTIFICATION: 'get_notification',
  ADD_EDIT_PROFILE: 'add_edit_profile',
  SET_IS_CREATED: 'set_is_created',
  SET_PROFILE: 'set_profile',
};

type Action = string;

const actions =
  (type: Action) =>
  (payload = {}) => {
    const store = require('./store').default;
    store.dispatch({
      type,
      payload,
    });
  };
export { actions, ACTION };
