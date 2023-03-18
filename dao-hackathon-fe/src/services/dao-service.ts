import { axiosWrapper } from "../helpers/axiosInstance";

const baseUrl = `/dao`;

const getProposal = async (proposalId: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/get-proposal?proposalId=${proposalId}`
  );
};

const getTotalVotes = async (proposalId: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/get-total-vote?proposalId=${proposalId}`
  );
};

const getAll = async () => {
  return await axiosWrapper.get(baseUrl);
};

const getById = async (id: string) => {
  return await axiosWrapper.get(`${baseUrl}/${id}`);
};

const getHashProposal = async (
  targets: any,
  values: any,
  calldatas: any,
  description: any
) => {
  return await axiosWrapper.get(
    `${baseUrl}/get-hash-proposal?targets=${targets}&values=${values}&calldatas=${calldatas}&description=${description}`
  );
};

const getListProposal = async (account: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/get-list-proposal-of-address?account=${account}`
  );
};

const getListAddressVote = async (proposalId: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/get-list-address-vote?proposalId=${proposalId}`
  );
};

const getProposalVotes = async (proposalId: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/proposal-votes?proposalId=${proposalId}`
  );
};

const getHasVoted = async (proposalId: string, account: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/has-voted?proposalId=${proposalId}&account=${account}`
  );
};

const getPowerVotePercent = async (proposalId: string, account: string) => {
  return await axiosWrapper.get(
    `${baseUrl}/power-vote-percent?proposalId=${proposalId}&account=${account}`
  );
};

const getPowerVoteAccount = async (account: string) => {
  return await axiosWrapper.get(`${baseUrl}/get-power?account=${account}`);
};

const getPower = async (address: string) => {
  return await axiosWrapper.get(`${baseUrl}/get-power?account=${address}`);
};

export const daoService = {
  getAll,
  getById,
  getProposal,
  getTotalVotes,
  getHashProposal,
  getListProposal,
  getListAddressVote,
  getProposalVotes,
  getHasVoted,
  getPowerVotePercent,
  getPowerVoteAccount,
  getPower,
};
