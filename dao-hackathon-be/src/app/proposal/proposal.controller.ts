import {
    Constant,
    logger,
    onError,
    onSuccess,
    OptionResponse,
} from "@constants";
// import { SignatureMiddleware } from '@middlewares';
import { Singleton } from "@providers";
import { IProposal } from "@schemas";
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
import { CastVoteInput, CreateProposalInput } from "./proposal";

const { NETWORK_STATUS_CODE, NETWORK_STATUS_MESSAGE } = Constant;
@Tags("proposal")
@Route("proposal")
@Security("authorize")
// @Middlewares([SignatureMiddleware])
export class ProposalController extends Controller {
    @Get("get-all-proposal")
    public async getAllProposal(): Promise<OptionResponse<IProposal[]>> {
        try {
            return onSuccess(await Singleton.getProposalInstance().GetAllProposal());
        } catch (error) {
            logger.error(error);
            this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
            return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("get-proposal")
    public async getProposal(
        @Query() proposal_id: string
    ): Promise<OptionResponse<IProposal>> {
        try {
            return onSuccess(
                await Singleton.getProposalInstance().GetProposal({ proposal_id })
            );
        } catch (error) {
            logger.error(error);
            this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
            return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    @Get("get-vote-percent")
    public async getVotePercent(
        @Query() proposal_id: string,
        @Query() wallet_address: string
    ): Promise<OptionResponse<IProposal>> {
        try {
            return onSuccess(
                await Singleton.getProposalInstance().GetVotePercentage(
                    {
                        proposal_id,
                        wallet_address
                    }
                )
            );
        } catch (error) {
            logger.error(error);
            this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
            return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("create-proposal")
    public async createProposal(
        @Body() payload: CreateProposalInput
    ): Promise<OptionResponse<IProposal>> {
        try {
            return onSuccess(
                await Singleton.getProposalInstance().CreateProposal(payload)
            );
        } catch (error) {
            logger.error(error);
            this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
            return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("update-all-proposal-state")
    public async updateAllProposalState(): Promise<OptionResponse<IProposal>> {
        try {
            return onSuccess(
                await Singleton.getProposalInstance().UpdateAllProposalState()
            );
        } catch (error) {
            logger.error(error);
            this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
            return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("cast-vote")
    public async castVote(
        @Body() payload: CastVoteInput
    ): Promise<OptionResponse<IProposal>> {
        try {
            return onSuccess(await Singleton.getProposalInstance().CastVote(payload));
        } catch (error) {
            logger.error(error);
            this.setStatus(NETWORK_STATUS_CODE.INTERNAL_SERVER_ERROR);
            return onError(NETWORK_STATUS_MESSAGE.INTERNAL_SERVER_ERROR);
        }
    }
}
