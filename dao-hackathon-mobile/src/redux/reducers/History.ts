/* eslint-disable import/no-anonymous-default-export */
import { fail, success } from '@src/utils/SagaHelper';

import { ActionType } from '..';
import { ACTION } from '../actions';
const {
  GET_HISTORY,
  SET_HISTORY_TRANSFER,
  SET_HISTORY_MINT,
  SET_CURRENT_RECEIVE,
  SET_PAGE_MINT,
  SET_PAGE_TRANSFER,
  SET_MINT_LOAD_MORE,
  SET_TRANSFER_LOAD_MORE,
} = ACTION;
const initialState = {
  dataMint: [],
  dataTransfer: [],
  pageMint: 0,
  pageTransfer: 0,
  mintLoadMore: true,
  transferLoadMore: true,
  currentReceive: 0,
  isLoading: true,
  error: false,
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case GET_HISTORY: {
      return { ...state, isLoading: true };
    }
    case SET_HISTORY_TRANSFER: {
      return {
        ...state,
        dataTransfer: action.payload.firstPage
          ? action.payload.data
          : state.dataMint.concat(action.payload.data),
      };
    }
    case SET_HISTORY_MINT: {
      return {
        ...state,
        dataMint: action.payload.firstPage
          ? action.payload.data
          : state.dataMint.concat(action.payload.data),
      };
    }
    case SET_PAGE_MINT: {
      return {
        ...state,
        pageMint: action.payload ? 1 : state.pageMint + 1,
      };
    }
    case SET_PAGE_TRANSFER: {
      return {
        ...state,
        pageTransfer: action.payload ? 1 : state.pageTransfer + 1,
      };
    }
    case SET_MINT_LOAD_MORE: {
      return { ...state, mintLoadMore: action.payload };
    }
    case SET_TRANSFER_LOAD_MORE: {
      return { ...state, transferLoadMore: action.payload };
    }
    case SET_CURRENT_RECEIVE: {
      return { ...state, currentReceive: action.payload };
    }
    case success(GET_HISTORY): {
      return {
        ...state,
        isLoading: false,
        error: false,
        data: action.payload,
      };
    }
    case fail(GET_HISTORY): {
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
