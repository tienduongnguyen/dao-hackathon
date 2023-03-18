import { Heading, Box, Wrap, Flex, Spacer } from "@chakra-ui/layout";
import { css } from "@emotion/css";
import { Image, Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CreateProposalModal from "components/CreateProposalModal";
import { cardService, daoService } from "services";
import { useGlobalState } from "../../store";
import DelegateModel from "components/Delegate";

export default function VoteRewardBox() {
  const [open, setOpen] = useState(false);
  const [powerVote, setPowerVote] = useState(0);
  const [connectedAccount] = useGlobalState("connectedAccount");
  const [totalStaked, setTotalStaked] = useState();
  const [totalVotingReward, setTotalVotingReward] = useState();
  const [openDelegate, setOpenDelegate] = useState(false);
  const [power, setPower] = useState("");

  useEffect(() => {
    if (connectedAccount) {
      daoService
        .getPowerVoteAccount(connectedAccount)
        .then((res) => {
          if (res.status == 200) setPowerVote(res?.data?.data?.amount);
        })
        .catch((err) => {
          console.log(err);
        });

      daoService
        .getPower(connectedAccount)
        .then((resp) => {
          setPower(resp.data.data.amount);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [connectedAccount]);

  useEffect(() => {
    cardService
      .getTotalNft()
      .then((resp) => {
        setTotalStaked(resp.data.data.total_nft);
      })
      .catch((err) => {
        console.log(err);
      });
    cardService
      .getTotalRewards()
      .then((resp) => {
        setTotalVotingReward(resp.data.data.total_rewards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Flex flexDirection="column">
        <Box className={voteRewardEarnBox}>
          <Heading className={voteRewardEarnHeader}>
            Vote - Earn Rewards
          </Heading>
          <Wrap mt="15px">
            <Image src="/images/icon-logo.png" boxSize="40px" alt="Icon Logo" />
            <Text fontWeight="400px" fontSize="24px" lineHeight="33px">
              MES: 0
            </Text>
          </Wrap>
        </Box>
        <Flex flexDirection="row" mt="60px">
          <Box className={voteRewardCard}>
            <Text fontSize="16px" lineHeight="24px" fontWeight="normal">
              Total Holders
            </Text>
            <Text fontSize="24px" lineHeight="36px" fontWeight="bold">
              {totalStaked
                ? new Intl.NumberFormat("de-DE").format(Number(totalStaked))
                : 0}{" "}
            </Text>
          </Box>
          <Spacer />
          <Box className={voteRewardCard}>
            <Text fontSize="16px" lineHeight="24px" fontWeight="normal">
              Total Voting Rewards
            </Text>
            <Text fontSize="24px" lineHeight="36px" fontWeight="bold">
              {totalVotingReward
                ? new Intl.NumberFormat("de-DE").format(
                    Number(totalVotingReward)
                  )
                : 0}{" "}
              MES
            </Text>
          </Box>
          <Spacer />
          <Box className={voteRewardCard}>
            <Text fontSize="16px" lineHeight="24px" fontWeight="normal">
              Your Voting Power
            </Text>
            <Text fontSize="24px" lineHeight="36px" fontWeight="bold">
              {powerVote ? powerVote : 0} Power
            </Text>
            <Text
              fontSize="12px"
              lineHeight="18px"
              fontWeight="normal"
              mt="-11px"
            >
              --
            </Text>
          </Box>
          <Spacer />
          <Box className={voteRewardCard}>
            <Text fontSize="16px" lineHeight="24px" fontWeight="normal">
              Your Voting Reward
            </Text>
            <Button
              color="#FFFFFF"
              fontSize="16px"
              w="100%"
              h="44px"
              bg="#7D31AF"
              borderRadius="100px"
              textAlign="center"
              onClick={() => setOpen(true)}
            >
              Create Proposal
            </Button>
          </Box>
          <Spacer />
          <Box className={voteRewardCard}>
            <Text fontSize="16px" lineHeight="24px" fontWeight="normal">
              Power {power}
            </Text>
            <Button
              color="#FFFFFF"
              fontSize="16px"
              w="100%"
              h="44px"
              bg="#7D31AF"
              borderRadius="100px"
              textAlign="center"
              onClick={() => setOpenDelegate(true)}
            >
              Delegate
            </Button>
          </Box>
        </Flex>
        <Box mt="44px">
          <Flex
            flexDirection="row"
            alignItems="center"
            className={timeProgress}
          >
            <Text mr="8px">In Progress: Epoch 49</Text>
            <Flex className={timeCountDown}>
              <Image boxSize="18px" mt="-2px" src="images/icon-time.svg" />
              <Text fontWeight="700">6 days 3h 17m left</Text>
            </Flex>
            <Text ml="8px">
              Vote on current epoch proposals to get your full reward.
            </Text>
          </Flex>
          <Text className={textNote}>
            Note: Vote on current epoch proposals to get your full reward.
          </Text>
        </Box>
      </Flex>
      {open && (
        <CreateProposalModal closeProposal={setOpen}></CreateProposalModal>
      )}
      {openDelegate && (
        <DelegateModel closeDelegate={setOpenDelegate}></DelegateModel>
      )}
    </>
  );
}

const voteRewardEarnBox = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 112px;
  font-family: "Noto Sans";
  font-style: normal;
`;
const voteRewardEarnHeader = css`
  font-family: "Noto Sans";
  font-weight: 700;
  font-size: 40px;
  line-height: 54px;
`;

const voteRewardCard = css`
  font-family: "Noto Sans";
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 16px;
  gap: 16px;
  width: 290px;
  height: 148px;
  background-image: url("images/card_vote_background.png");
  background-repeat: no-repeat;
  background-size: 100%;
`;

const timeProgress = css`
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
`;

const textNote = css`
  font-family: "Noto Sans";
  font-style: italic;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  margin-top: 12px;
`;

const timeCountDown = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  gap: 4px;
  height: 32px;
  background: rgba(46, 26, 84, 0.8);
  border-radius: 100px;
  font-family: "Noto Sans";
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
`;
