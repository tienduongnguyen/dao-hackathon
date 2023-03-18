/* eslint-disable import/no-anonymous-default-export */
import { fail, success } from '@src/utils/SagaHelper';

import { ActionType } from '..';
import { ACTION } from '../actions';
const { GET_LIST_NFT } = ACTION;
const initialState = {
  data: [],
  isLoading: true,
  isLoadMore: false,
  isLoadMoreDone: false,
  error: false,
  pageNum: 1,
};

export default function (state = initialState, action: ActionType) {
  switch (action.type) {
    case GET_LIST_NFT: {
      const pageNum = action.payload.pageNum || 1;
      return {
        ...state,
        isLoading: pageNum === 1,
        isLoadMore: !!pageNum,
        data: pageNum === 1 ? [] : state.data,
        pageNum,
      };
    }

    case success(GET_LIST_NFT): {
      const { address } = action.params;
      const { pageNum } = action.params;
      let data = [];

      if (pageNum && pageNum > 1) {
        data = JSON.parse(JSON.stringify(state.data));
        data = data.filter((item: any) => item.owner === address);
        const mapDataTokenAddress = data.map((e: any) => e.mint);

        action.payload.forEach(async (elem: any) => {
          if (
            !mapDataTokenAddress.includes(elem.mint) &&
            elem.owner === address
          ) {
            data.push(elem);
          }
        });
      } else {
        data = action.payload;
      }

      return {
        ...state,
        error: false,
        data,
        isLoading: false,
        isLoadMore: false,
        isLoadMoreDone: action.payload.length === 0,
      };
    }
    case fail(GET_LIST_NFT): {
      return {
        ...state,
        error: true,
        isLoading: false,
        isLoadMore: false,
      };
    }
    default:
      return state;
  }
}
