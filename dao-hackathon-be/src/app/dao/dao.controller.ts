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
import { DAOService } from "./dao.service";

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;
const daoService = new DAOService();
@Tags("dao")
@Route("dao")
@Security("authorize")
// @Middlewares([SignatureMiddleware])
export class DAOController extends Controller {
  @Get("has-voted")
  public async hasVoted(
    @Query() proposalId: string,
    @Query() account: string
  ): Promise<OptionResponse<boolean>> {
    try {
      const status = await daoService.HasVoted(proposalId, account);
      return onSuccess({ status });
    } catch (error: any) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("proposal-votes")
  public async proposalVotes(
    @Query() proposalId: string
  ): Promise<OptionResponse<any>> {
    try {
      console.log(`start`);

      const result = await daoService.ProposalVotes(proposalId);
      console.log(`end`);

      return onSuccess({ result });
    } catch (error: any) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("proposal-state")
  public async proposalState(
    @Query() proposalId: string
  ): Promise<OptionResponse<any>> {
    try {
      const state = await daoService.ProposalState(proposalId);
      return onSuccess({ state });
    } catch (error: any) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-time-proposal")
  public async getTimeProposal(
    @Query() startBlock: number,
    @Query() endBlock: number
  ): Promise<OptionResponse<any>> {
    try {
      const blockNumber = await daoService.GetTimeProposal(
        startBlock,
        endBlock
      );
      return onSuccess({ blockNumber });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-total-vote")
  public async getTotalVote(
    @Query() proposalId: string
  ): Promise<OptionResponse<any>> {
    try {
      const amount = await daoService.GetTotalVote(proposalId);
      return onSuccess({ amount });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-power")
  public async getPower(
    @Query() account: string
  ): Promise<OptionResponse<any>> {
    try {
      const amount = await daoService.GetPower(account);
      return onSuccess({ amount });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("power-vote-percent")
  public async powerVotePercent(
    @Query() proposalId: string,
    @Query() account: string
  ): Promise<OptionResponse<any>> {
    try {
      const percent = await daoService.PowerVotePercent(proposalId, account);
      return onSuccess({ percent });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-list-address-vote")
  public async getListAddressVote(
    @Query() proposalId: string
  ): Promise<OptionResponse<any>> {
    try {
      const listAddress = await daoService.getListAddressVote(proposalId);
      return onSuccess({ listAddress });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-list-proposal-of-address")
  public async getListVote(
    @Query() account: string
  ): Promise<OptionResponse<any>> {
    try {
      const listVotes = await daoService.getListProposalOfAddress(account);
      return onSuccess({ listVotes });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-proposal")
  public async getProposal(
    @Query() proposalId: string
  ): Promise<OptionResponse<any>> {
    try {
      const result = await daoService.getProposal(proposalId);
      return onSuccess(result);
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }

  @Get("get-hash-proposal")
  public async getHashProposal(
    @Query() targets: string[],
    @Query() values: number[],
    @Query() calldatas: string[],
    @Query() description: string
  ): Promise<OptionResponse<any>> {
    try {
      const proposalId = await daoService.getHashProposal(
        targets,
        values,
        calldatas,
        description
      );
      return onSuccess({ proposalId });
    } catch (error) {
      logger.error(error);
      this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
      return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
    }
  }
}
