interface GetUserInput {
  wallet_address: string;
}

interface CreateUserInput {
  wallet_address: string;
}

interface UpdateVoteInput {
  wallet_address: string;
  votes: number;
}

interface PushProposalInput {
  wallet_address: string;
  proposal_id: string;
}

export { GetUserInput, CreateUserInput, UpdateVoteInput, PushProposalInput };
