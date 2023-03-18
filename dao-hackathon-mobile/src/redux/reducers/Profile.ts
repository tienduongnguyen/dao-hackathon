/* eslint-disable import/no-anonymous-default-export */
import { ActionType } from '..';
import { ACTION } from '../actions';
import { ProfileState } from '../models/store.d';
const { SET_PROFILE } = ACTION;

const initialState: ProfileState = {
  profile: undefined,
  isCreated: false,
};

export default function (
  state:
    | ProfileState
    | {
        profile: undefined;
      } = initialState,
  action: ActionType,
) {
  switch (action.type) {
    case SET_PROFILE: {
      return {
        ...state,
        profile: action.payload,
      };
    }
    default:
      return state;
  }
}
