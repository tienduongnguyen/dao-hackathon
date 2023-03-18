/* eslint-disable import/no-anonymous-default-export */
import { ActionType, AppState } from '..';
import { ACTION } from '../actions';
const { SET_NETWORK_TYPE, SET_APP_EXPIRED } = ACTION;
const initialState: AppState = {
  networkType: 'sol',
  appExpired: true,
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case SET_NETWORK_TYPE: {
      return { ...state, networkType: action.payload.networkType };
    }

    case SET_APP_EXPIRED: {
      return { ...state, appExpired: action.payload.appExpired };
    }

    default:
      return state;
  }
}
