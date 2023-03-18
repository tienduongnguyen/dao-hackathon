/* eslint-disable import/no-anonymous-default-export */
import { APP_SCREEN } from '@src/navigation/screen-types';

import { ActionType } from '..';
import { ACTION } from '../actions';
const { SCREEN_NAVIGATION } = ACTION;
const initialState = {
  route: APP_SCREEN.SPLASH,
  params: {},
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case SCREEN_NAVIGATION: {
      return {
        ...state,
        route: action.payload.route,
        params: action.payload.params,
      };
    }
    default:
      return state;
  }
}
