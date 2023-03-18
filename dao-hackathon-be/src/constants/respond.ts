import { logger, Constant } from "@constants";
type SuccessResponse<T> = {
  data: T | any;
  message: string;
  success: boolean;
};

type ErrorResponse = {
  message: string;
  success: boolean;
};
type OptionResponse<T> = SuccessResponse<T> | ErrorResponse;

function onError(error: any, message?: string): ErrorResponse {
  let msg = null;
  if (typeof error == "object") {
    logger.error(error);
    msg = error.message;
  } else {
    msg = error;
  }
  return {
    message:
      msg || message || Constant.NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    success: false,
  };
}

function onSuccess<T>(data?: T): SuccessResponse<T> {
  return {
    data: data || null,
    success: true,
    message: Constant.NETWORK_STATUS_MESSAGE.SUCCESS,
  };
}

function onSuccessArray<T>(data: T[]): SuccessResponse<T[]> {
  if (data && data.length != 0) {
    return {
      data,
      success: true,
      message: Constant.NETWORK_STATUS_MESSAGE.SUCCESS,
    };
  }
  return {
    data: [],
    success: true,
    message: Constant.NETWORK_STATUS_MESSAGE.EMPTY,
  };
}

export { onError, onSuccess, onSuccessArray, OptionResponse };
