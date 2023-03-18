import { governor, connection } from "@providers";
import { State } from "bupbethuytinh";

export class DAOService {
  public async HasVoted(proposalId: string, account: string): Promise<boolean> {
    try {
      const result = await governor.hasVoted(proposalId, account);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async ProposalVotes(proposalId: string): Promise<any> {
    try {
      console.log(`here`);

      const result = await governor.getProposalVotes(proposalId);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async ProposalState(proposalId: string): Promise<State> {
    try {
      const result = await governor.getStateProposal(proposalId);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetTimeProposal(
    startBlock: number,
    endBlock: number
  ): Promise<any> {
    try {
      const result = await governor.getTimeProposal(startBlock, endBlock);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetTotalVote(proposalId: string): Promise<any> {
    try {
      const result = await governor.getTotalVote(proposalId);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async GetPower(account: string): Promise<any> {
    try {
      const block = await connection.web3.eth.getBlockNumber();
      const result = await governor.getVote(account, block - 1);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async PowerVotePercent(
    proposalId: string,
    account: string
  ): Promise<any> {
    try {
      const result = await governor.powerVotePercent(proposalId, account);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async getListAddressVote(proposalId: string): Promise<any> {
    try {
      const result = await governor.getListAddressVote(proposalId);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async getListProposalOfAddress(account: string): Promise<any> {
    try {
      const result = await governor.getListVote(account);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async getProposal(proposalId: string): Promise<any> {
    try {
      const result = await governor.getProposal(proposalId);
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }

  public async getHashProposal(
    targets: string[],
    values: number[],
    calldatas: string[],
    description: string
  ): Promise<any> {
    try {
      const result = await governor.getHashProposal(
        targets,
        values,
        calldatas,
        description
      );
      return result;
    } catch (error: any) {
      throw error.message;
    }
  }
}
