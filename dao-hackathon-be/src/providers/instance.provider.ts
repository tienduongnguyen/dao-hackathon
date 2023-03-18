import { UserService } from "@app/user/user.service";
import { ProposalService } from "@app/proposal/proposal.service";

class Singleton {
  private static userInstance: UserService;
  private static proposalInstance: ProposalService;

  private constructor() {}

  public static getUserInstance(): UserService {
    if (!Singleton.userInstance) {
      Singleton.userInstance = new UserService();
    }
    return Singleton.userInstance;
  }

  public static getProposalInstance(): ProposalService {
    if (!Singleton.proposalInstance) {
      Singleton.proposalInstance = new ProposalService();
    }
    return Singleton.proposalInstance;
  }
}

export { Singleton };
