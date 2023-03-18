import { Flex, Spacer } from "@chakra-ui/layout";
import { Text, Progress, Checkbox } from "@chakra-ui/react";
import { css } from "@emotion/css";
import config from "../../abi/contract.json";
import { ethers } from "ethers";
import { proposalService, userService } from "services";
import { useEffect, useState } from "react";

enum ProposalSupport {
  NO,
  YES,
  ABSTAIN,
}

declare let window: any;

export default function ProgressVoteDetail({
  progressInfo,
  hasVoted,
  handleVote,
  onChangeVote,
  walletAddress,
  voters,
}: any) {
  const { index, support, progress, proposalId, proposalState } = progressInfo;
  const [isChecked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    const result = voters.filter(
      (vote: any) => vote.address == walletAddress && vote.support == support
    );
    result.length ? setChecked(true) : setChecked(false);
  }, [hasVoted, walletAddress, support, voters]);

  const handleSubmitVote = async (e: any) => {
    try {
      if (e.target.checked) {
        handleVote(true);
        const support = e.target.value;
        if (!window.ethereum) {
          console.log("please install MetaMask");
          return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let wallet_address = "";
        await provider.send("eth_requestAccounts", []).then((accounts) => {
          if (accounts.length > 0) {
            wallet_address = accounts[0];
          }
        });
        userService.getUser(wallet_address).then((res) => {
          if (!res.data.success) {
            userService.createUser(wallet_address);
          }
        });
        const signer = provider.getSigner();
        const contracts = new ethers.Contract(
          config.MesmeGovernor.address,
          config.MesmeGovernor.abi,
          signer
        );
        await contracts.castVote(proposalId, support);
        await proposalService.castVote(proposalId, wallet_address, support);
        onChangeVote();
        setChecked(true);
      }
    } catch (error) {
      console.log("error", error);
      setChecked(false);
      handleVote(false);
    }
  };

  return (
    <Flex className={progressVoteDetailContainer}>
      <Flex
        className="progressInfo"
        flexDirection="row"
        justify="space-between"
        w="100%"
      >
        <Checkbox
          colorScheme="green"
          value={support}
          onChange={handleSubmitVote}
          isDisabled={proposalState != 1 || hasVoted}
          isChecked={isChecked}
          mr="8px"
        />

        <Text
          fontSize="14px"
          lineHeight="21px"
          fontWeight="400"
        >{`${index}. ${ProposalSupport[support]}`}</Text>
        <Spacer />
        <Text fontSize="14px" lineHeight="21px" fontWeight="700">{`${
          Math.round(progress * 100) / 100
        }%`}</Text>
      </Flex>
      <Flex w="100%">
        <Progress
          value={progress}
          background="#000000"
          borderRadius="1000px"
          border="1px solid #0C6967"
          w="100%"
          sx={{
            "& > div": {
              background:
                "linear-gradient(270deg, #0AB39C 0%, #1A306A 100%), linear-gradient(0deg, #0AB39C, #0AB39C)",
            },
          }}
        />
      </Flex>
    </Flex>
  );
}
const progressVoteDetailContainer = css`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;
  min-width: 30%;
  max-width: calc(33% - 16px);
  font-family: "Noto Sans";
  font-style: normal;
`;
