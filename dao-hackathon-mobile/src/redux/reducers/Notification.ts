/* eslint-disable import/no-anonymous-default-export */
import { ActionType, NotificationState } from '..';
import { ACTION } from '../actions';
const { SET_NOTIFICATION } = ACTION;

const initialState: NotificationState = {
  data: [],
  metadata: [],
  offset: 0,
  canLoadMore: false,
};

export default function (
  state:
    | NotificationState
    | {
        data: [];
        metadata: [];
      } = initialState,
  action: ActionType,
) {
  switch (action.type) {
    case SET_NOTIFICATION: {
      if (action.payload?.isRefresh) {
        return {
          data: [...action.payload?.data],
          metadata: action.payload?.metadata,
          offset: action?.payload?.offset,
          canLoadMore: action?.payload?.canLoadMore,
        };
      }
      return {
        ...state,
        data: [...(state?.data || {}), ...action.payload?.data],
        metadata: action.payload?.metadata,
        offset: action?.payload?.offset,
        canLoadMore: action?.payload?.canLoadMore,
      };
    }
    default:
      return state;
  }
}
