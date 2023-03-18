import { Proposal, User } from "@schemas";
import {
    GetProposalInput,
    CreateProposalInput,
    UpdateProposalStateInput,
    CastVoteInput,
    GetVotePercentageInput,
} from "./proposal";
import { State, Support } from "bupbethuytinh";
import { Voter } from "@constants";
import { DAOService } from "@app/dao/dao.service";
import { UserService } from "@app/user/user.service";

export class ProposalService {
    async GetProposal({ proposal_id }: GetProposalInput) {
        try {
            const proposal = await Proposal.findOne({ proposal_id });
            if (!proposal) throw { message: "Proposal not found" };
            return proposal;
        } catch (error: any) {
            throw error.message;
        }
    }

    async CreateProposal({
        proposal_id,
        proposal_name,
        issued_by,
        start_date,
        end_date,
        description,
        total_votes,
        total_address,
    }: CreateProposalInput) {
        try {
            const proposal = await Proposal.exists({ proposal_id });
            if (proposal) throw { message: "Proposal already exists" };
            // const daoService = new DAOService();
            // let state = await daoService.ProposalState(proposal_id);
            let state = State.Pending.toString();

            return await Proposal.create({
                proposal_id,
                proposal_name,
                state,
                issued_by,
                start_date,
                end_date,
                description,
                total_votes,
                total_address,
            });
        } catch (error: any) {
            throw error.message;
        }
    }

    async CastVote({ proposal_id, wallet_address, support }: CastVoteInput) {
        try {
            const userService = new UserService();
            await userService.UpdateAllUserVote();

            const user = await User.findOneAndUpdate(
                { wallet_address },
                { $addToSet: { proposals: proposal_id } },
                { new: true }
            );
            if (!user) throw { message: "User not found" };

            const voter: Voter = {
                address: wallet_address,
                support: support,
                vote: user.votes,
            };

            let updateVotes = {};
            if (voter.support === Support.FORVOTE) {
                updateVotes = {
                    $inc: {
                        for_votes: voter.vote,
                        total_votes: voter.vote,
                        total_address: 1,
                    },
                };
            }
            if (voter.support === Support.AGAINSTVOTE) {
                updateVotes = {
                    $inc: {
                        against_votes: voter.vote,
                        total_votes: voter.vote,
                        total_address: 1,
                    },
                };
            }
            if (voter.support === Support.ABSTAINVOTE) {
                updateVotes = {
                    $inc: {
                        abstain_votes: voter.vote,
                        total_votes: voter.vote,
                        total_address: 1,
                    },
                };
            }

            const proposal = await Proposal.findOneAndUpdate(
                { proposal_id },
                { $addToSet: { voters: voter }, ...updateVotes },
                { new: true }
            );
            if (!proposal) throw { message: "Proposal not found" };
            return proposal;
        } catch (error: any) {
            throw error.message;
        }
    }

    async UpdateProposalState({
        proposal_id,
        proposal_state,
    }: UpdateProposalStateInput) {
        try {
            const proposal = await Proposal.findOneAndUpdate(
                { proposal_id },
                { proposal_state },
                { new: true }
            );
            if (!proposal) throw { message: "Proposal not found" };
            return proposal;
        } catch (error: any) {
            throw error.message;
        }
    }

    async GetAllProposal() {
        try {
            const proposals = await Proposal.find({}).sort({ created_at: -1 });
            if (!proposals) throw { message: "Proposal not found" };
            return proposals;
        } catch (error: any) {
            throw error.message;
        }
    }

    async UpdateAllProposalState() {
        try {
            const proposals = await Proposal.find({}).sort({ created_at: -1 });
            if (!proposals) throw { message: "Proposal not found" };
            const daoService = new DAOService();
            proposals.forEach(async (proposal) => {
                const proposalState = await daoService.ProposalState(
                    proposal.proposal_id
                );
                let state = await this.CheckState(proposalState);
                return await this.UpdateProposalState({
                    proposal_id: proposal.proposal_id,
                    proposal_state: state,
                });
            });
            return proposals;
        } catch (error: any) {
            throw error.message;
        }
    }

    private async CheckState(state: any) {
        const strState = state.toString();
        switch (strState) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
                return state;

            default:
                return State.Pending;
        }
    }

    async GetVotePercentage({
        proposal_id,
        wallet_address,
    }: GetVotePercentageInput) {
        try {
            const proposal = await Proposal.findOne({ proposal_id });
            if (!proposal) throw { message: "Proposal not found" };
            let percent = 0;
            proposal.voters.find((voter) => {
                if (voter.address === wallet_address.toLowerCase()) {
                    percent = voter.vote / proposal.total_votes;
                }
            });
            return percent;
        } catch (error: any) {
            throw error.message;
        }
    }
}
