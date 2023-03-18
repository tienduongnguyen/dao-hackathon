import {
  Constant,
  logger,
  onError,
  onSuccess,
  OptionResponse,
} from "@constants";
// import { SignatureMiddleware } from '@middlewares';
import { Singleton } from "@providers";
import { IUser } from "@schemas";
import {
  Body,
  Controller,
  Get,
  //   Middlewares,
  Post,
  Route,
  Query,
  Security,
  Tags,
} from "tsoa";
import { CreateUserInput } from "./user";

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;
@Tags("user")
@Route("user")
@Security("authorize")
// @Middlewares([SignatureMiddleware])
export class UserController extends Controller {
  @Get("get-user")
  public async getUser(
    @Query() wallet_address: string
  ): Promise<OptionResponse<IUser>> {
    try {
      return onSuccess(
        await Singleton.getUserInstance().GetUser({ wallet_address })
      );
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("create-user")
  public async createUser(
    @Body() payload: CreateUserInput
  ): Promise<OptionResponse<IUser>> {
    try {
      return onSuccess(await Singleton.getUserInstance().CreateUser(payload));
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Post("update-all-user-vote")
  public async updateAllUserVote(): Promise<OptionResponse<IUser>> {
    try {
      return onSuccess(await Singleton.getUserInstance().UpdateAllUserVote());
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }
}
