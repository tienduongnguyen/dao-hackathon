import { axiosWrapper } from "helpers/axiosInstance";

const baseUrl = "/proposal";

const getProposal = async (proposalId: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/get-proposal?proposal_id=${proposalId}`
  );
};

const getAllProposals = async () => {
  return await axiosWrapper.get(`${baseUrl}/get-all-proposal`);
};

const updateAllProposals = async () => {
  return await axiosWrapper.post(`${baseUrl}/update-all-proposal-state`, {});
};

const createProposal = async (
  proposalId: string,
  proposalName: string,
  issued_by: string,
  start_date: any,
  end_date: any,
  description: string
) => {
  return await axiosWrapper.post(`${baseUrl}/create-proposal`, {
    proposal_id: proposalId,
    proposal_name: proposalName,
    issued_by: issued_by,
    start_date: start_date,
    end_date: end_date,
    description: description,
    total_votes: 0,
    total_address: 0,
  });
};

const castVote = async (
  proposal_id: string,
  wallet_address: string,
  support: number
) => {
  return await axiosWrapper.post(`${baseUrl}/cast-vote`, {
    proposal_id,
    wallet_address,
    support,
  });
};

const getPowerVotePercent = async (proposalId: string, account: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/get-vote-percent?proposal_id=${proposalId}&wallet_address=${account}`
  );
};

export const proposalService = {
  createProposal,
  getProposal,
  getAllProposals,
  castVote,
  updateAllProposals,
  getPowerVotePercent,
};
