import { fail, success } from './SagaHelper';

// eslint-disable-next-line import/no-anonymous-default-export
export default (type: any, action: any, state: any) => {
  switch (action.type) {
    case type: {
      return { ...state, isLoading: true };
    }
    case success(type): {
      return {
        ...state,
        isLoading: false,
        error: false,
        data: action.payload,
      };
    }
    case fail(type): {
      return {
        ...state,
        error: true,
        isLoading: false,
      };
    }
    default:
      return state;
  }
};
