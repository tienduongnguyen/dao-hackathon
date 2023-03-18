import React, { useEffect, useState } from "react";
import { Flex, Spacer, Stack } from "@chakra-ui/layout";
import { Text, Image } from "@chakra-ui/react";
import { css } from "@emotion/css";

import ProgressVoteDetail from "components/ProgressVoteDetail";
import VotingDescription from "components/VotingDescription";
import WalletRank from "components/WalletRank";
import moment from "moment";
import { daoService } from "services";

enum ProposalState {
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

import { useGlobalState } from "../../store";

export default function ProposalDetail({ proposal, onChangeVote }: any) {
  const {
    start_date,
    end_date,
    proposal_name,
    proposal_state,
    proposal_id,
    total_votes,
    description,
    for_votes,
    against_votes,
    abstain_votes,
    total_address,
    voters,
  } = proposal;
  const [dropDown, setDropDown] = useState<boolean>(false);

  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [connectedAccount] = useGlobalState("connectedAccount");
  const handleVote = (value: boolean) => {
    setHasVoted(value);
  };

  useEffect(() => {
    if (connectedAccount) {
      daoService.getHasVoted(proposal_id, connectedAccount).then((res) => {
        if (res.status == 200) {
          setHasVoted(res.data.data.status);
        }
      });
    }
  }, [proposal_id, connectedAccount]);

  const progressInfos: any[] = [
    {
      index: 1,
      support: 1,
      progress: total_votes ? (for_votes / total_votes) * 100 : 0,
      proposalId: proposal_id,
      proposalState: proposal_state,
    },
    {
      index: 2,
      support: 0,
      progress: total_votes ? (against_votes / total_votes) * 100 : 0,
      proposalId: proposal_id,
      proposalState: proposal_state,
    },
    {
      index: 3,
      support: 2,
      progress: total_votes ? (abstain_votes / total_votes) * 100 : 0,
      proposalId: proposal_id,
      proposalState: proposal_state,
    },
  ];

  const onDropDown = () => {
    setDropDown(true);
  };

  const onUpDown = () => {
    setDropDown(false);
  };
  return (
    <Flex className={proposalDetailContainer}>
      <Flex
        className={proposalHeader}
        flexDirection="row"
        borderBottom={dropDown ? "1px solid #422574" : "none"}
      >
        <Text className={proposalTitle}>{proposal_name}</Text>
        <Text fontSize="12px" fontWeight="400">
          {`Ended ${moment(end_date).format("DD MMMM YYYY")}`}
        </Text>
        <Text
          className={
            proposal_state == ProposalState.Active ||
            proposal_state == ProposalState.Succeeded ||
            proposal_state == ProposalState.Executed
              ? proposalStatusGreen
              : proposalStatusRed
          }
        >
          {ProposalState[proposal_state]}
        </Text>
        <Text className={proposalId}>{`ID #${proposal_id}`}</Text>
        <Spacer />
        {dropDown ? (
          <Image
            src="images/up-cicle-icon.svg"
            boxSize="28px"
            onClick={onUpDown}
            alt=""
          />
        ) : (
          <Image
            src="images/down-cicle-icon.svg"
            boxSize="28px"
            onClick={onDropDown}
            alt=""
          />
        )}
      </Flex>
      {dropDown && (
        <Stack mb="24px" w="100%" px="25px">
          <Flex className={listProgressVote}>
            {progressInfos.map((progressInfo) => (
              <ProgressVoteDetail
                progressInfo={progressInfo}
                hasVoted={hasVoted}
                handleVote={handleVote}
                onChangeVote={onChangeVote}
                walletAddress={connectedAccount}
                voters={voters}
                key={progressInfo.index}
              />
            ))}
          </Flex>
          <VotingDescription {...proposal} />
          <WalletRank {...proposal} />
        </Stack>
      )}
    </Flex>
  );
}

const proposalDetailContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  width: 100%;
  background: rgba(46, 26, 84, 0.8);
  border-radius: 8px;
  margin-top: 16px;
`;

const proposalHeader = css`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 24px 16px;
  gap: 18px;
  height: 44px;
  width: 100%;
`;
const proposalTitle = css`
  padding: 0px 16px 0px 0px;
  height: 24px;
  border-right: 1px solid #422574;
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
`;
const proposalStatusGreen = css`
  height: 26px;
  background: rgba(25, 251, 155, 0.1);
  border-radius: 1000px;
  color: #19fb9b;
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  padding: 4px 8px;
`;

const proposalStatusRed = css`
  height: 26px;
  background: rgba(255, 41, 91, 0.1);
  border-radius: 1000px;
  color: #ff295b;
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  padding: 4px 8px;
`;

const proposalId = css`
  padding: 4px 8px;
  height: 26px;
  background: rgba(25, 251, 155, 0.1);
  border-radius: 1000px;
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
`;

const listProgressVote = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  padding: 24px 0px;
  gap: 24px;
  width: 100%;
`;
