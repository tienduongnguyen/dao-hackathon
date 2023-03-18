import { NextFunction, Request, Response } from "express";
import { connection } from "@providers";
import { onError, Constant, logger } from "@constants";
const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;

const SignatureMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { authorize } = req.headers;
    if (!authorize) {
      // return res
      //   .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
      //   .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED));
    }
    authorize = authorize as string;
    const [message, signature] = authorize.split(":");

    const address = connection.web3.eth.accounts.recover(message, signature);
    const [addressFromMessage, expire] = message.split("-");

    if (addressFromMessage.toLowerCase() != address.toLowerCase()) {
      // return res
      //   .status(NETWORK_STATUS_CODE.BAD_REQUEST)
      //   .json(onError(NETWORK_STATUS_MESSAGE.BAD_REQUEST));
    }
    if (!connection.web3.utils.isAddress(address)) {
      // return res
      //   .status(NETWORK_STATUS_CODE.BAD_REQUEST)
      //   .json(onError(NETWORK_STATUS_MESSAGE.BAD_REQUEST));
    }

    if (Date.now() > parseInt(expire)) {
      // return res.status(NETWORK_STATUS_CODE.EXPIRE).json(onError(NETWORK_STATUS_MESSAGE.EXPIRE));
    }

    req.headers.address = address.toLowerCase();
    req.headers.signature = signature;
    return next();
  } catch (error) {
    // DEBUG
    return next();
    logger.error(error);
    return res
      .status(NETWORK_STATUS_CODE.UNAUTHORIZED)
      .json(onError(NETWORK_STATUS_MESSAGE.UNAUTHORIZED));
  }
};

export { SignatureMiddleware };
