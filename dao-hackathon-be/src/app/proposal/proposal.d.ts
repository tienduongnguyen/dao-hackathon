import { State, Support } from "bupbethuytinh";

interface GetProposalInput {
    proposal_id: string;
}

interface GetVotePercentageInput {
    proposal_id: string;
    wallet_address: string;
}

interface CreateProposalInput {
    proposal_id: string;
    proposal_name: string;
    issued_by: string;
    start_date: number;
    end_date: number;
    description: string;
    total_votes: number;
    total_address: number;
}

interface CastVoteInput {
    proposal_id: string;
    wallet_address: string;
    support: Support;
}

interface UpdateProposalStateInput {
    proposal_id: string;
    proposal_state: State;
}

export {
    GetProposalInput,
    GetVotePercentageInput,
    CreateProposalInput,
    UpdateProposalStateInput,
    CastVoteInput,
};
