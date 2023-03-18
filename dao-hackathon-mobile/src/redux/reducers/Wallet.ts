/* eslint-disable import/no-anonymous-default-export */
import { fail, success } from '@src/utils/SagaHelper';

import { ActionType } from '..';
import { ACTION } from '../actions';
const { GET_ADDRESS, SET_BALANCE, SELECT_ADDRESS, SELECT_ADDRESS_KEY } = ACTION;
const initialState = {
  data: [],
  dataName: [],
  dataNetwork: [],
  select: -1,
  balance: 0,
  isLoading: true,
  error: false,
  address: '',
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case GET_ADDRESS: {
      return { ...state, isLoading: true };
    }
    case SET_BALANCE: {
      return { ...state, balance: action.payload };
    }
    case SELECT_ADDRESS: {
      return { ...state, select: action.payload, balance: 0, isLoading: false };
    }
    case SELECT_ADDRESS_KEY: {
      return { ...state, address: action.payload };
    }
    case success(GET_ADDRESS): {
      let { select } = state;
      if (action.payload.length > 0 && select === -1) {
        select = 0;
      }
      return {
        ...state,
        isLoading: false,
        error: false,
        data: action.payload.map((e: any) => e.address),
        dataName: action.payload.map((e: any) => e.name),
        dataNetwork: action.payload.map((e: any) => e.networkType),
        select,
      };
    }
    case fail(GET_ADDRESS): {
      return {
        ...state,
        error: true,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
