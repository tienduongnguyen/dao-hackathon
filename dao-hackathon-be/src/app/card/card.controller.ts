import {
  // Body,
  Controller,
  Get,
  // Middlewares,
  // Post,
  Query,
  Route,
  Security,
  Tags,
} from "tsoa";
import {
  Constant,
  logger,
  onError,
  onSuccess,
  OptionResponse,
} from "@constants";
import { CardService } from "./card.service";
import { Position, PositionPower } from "bupbethuytinh";

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;
const cardService = new CardService();
@Tags("card")
@Route("card")
@Security("authorize")
// @Middlewares([SignatureMiddleware])
export class CardController extends Controller {
  @Get("get-voting-units")
  public async getVotingUnits(
    @Query() address: string
  ): Promise<OptionResponse<any>> {
    try {
      const amount = await cardService.GetVotingUnits(address);
      return onSuccess({ amount });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-card-power")
  public async getCardPower(
    @Query() tokenId: string
  ): Promise<OptionResponse<PositionPower>> {
    try {
      const power = await cardService.GetCardPower(tokenId);
      return onSuccess({ power });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-position-power")
  public async getPositionPower(
    @Query() position: Position
  ): Promise<OptionResponse<PositionPower>> {
    try {
      const power = await cardService.GetPositionPower(position);
      return onSuccess({ power });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-position")
  public async getPosition(
    @Query() tokenId: string
  ): Promise<OptionResponse<Position>> {
    try {
      const position = await cardService.GetPosition(tokenId);
      return onSuccess({ position });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-total-nft")
  public async getTotalHolders(): Promise<OptionResponse<any>> {
    try {
      const totalNFT = await cardService.GetTotalNFT();
      return onSuccess({ total_nft: totalNFT });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-total-rewards")
  public async getTotalRewards(): Promise<OptionResponse<number>> {
    try {
      const totalRewards = await cardService.GetTotalRewards();
      return onSuccess({ total_rewards: totalRewards });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }
}
