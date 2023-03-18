import { Flex, Spacer } from '@chakra-ui/layout';
import {
    Select,
    Text,
    Button,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import ProposalDetail from 'components/ProposalDetail';
import { useEffect, useState } from 'react';
import { proposalService } from 'services';
import { useSelector } from 'react-redux';

export default function ProposalsVote() {
    const [proposals, setProposals] = useState<any[] | undefined>([]);
    const [voteChange, setVoteChange] = useState<boolean>(false);
    const updatedProposals = useSelector(
        (state: any) => state.listProposal.value
    );
    useEffect(() => {
        const fetchData = async () => {
            if (updatedProposals.length) {
                setProposals(updatedProposals);
            } else {
                const listProposal = await proposalService.getAllProposals();
                setProposals(listProposal.data.data);
            }
        };
        fetchData();
    }, [voteChange, updatedProposals]);
    useEffect(() => {
        window.addEventListener('load', (event) => {
            console.log('page is fully loaded');
        });

        window.onload = async () => {
            const listProposal = await proposalService.updateAllProposals();
            setProposals(listProposal.data.data);
        };
    });

    const handleVoteChange = () => {
        setVoteChange((prevState) => !prevState);
    };

    return (
        <Flex
            w="100%"
            my="40px"
            flexDirection="column"
            id="proposalVoteContainer"
        >
            <Flex
                flexDirection="row"
                justify="space-between"
                className={searchBoxContainer}
            >
                <Flex flexDirection="row" align="center">
                    <Text fontWeight="700" fontSize="20px" mr="24px">
                        Proposals
                    </Text>
                    <Select
                        className={selectStatusBox}
                        defaultValue="all"
                        _focus={{ outline: 'none' }}
                    >
                        <option value="All">All</option>
                        <option value="Approved">Approved</option>
                        <option value="Excuted">Excuted</option>
                        <option value="Failed">Failed</option>
                        <option value="Canceled">Canceled</option>
                    </Select>
                </Flex>
                <Spacer />
                <Flex className={searchBox}>
                    <InputGroup>
                        <Input
                            className="Input"
                            border="none"
                            placeholder="Search proposals"
                            _focus={{ outline: 'none' }}
                        />
                        <InputRightElement pointerEvents="none">
                            <SearchOutlined
                                style={{
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    fontWeight: '900',
                                    strokeWidth: '300',
                                }}
                            />
                        </InputRightElement>
                    </InputGroup>
                </Flex>
            </Flex>
            {proposals && proposals.length > 0 && (
                <Flex className={listProposals} flexDirection="column">
                    {proposals.map((proposal) => (
                        <ProposalDetail
                            proposal={proposal}
                            onChangeVote={handleVoteChange}
                            key={proposal._id}
                        />
                    ))}
                </Flex>
            )}
        </Flex>
    );
}

const searchBoxContainer = css`
    font-family: 'Noto Sans';
    font-style: normal;
    color: #ffffff;
`;

const selectStatusBox = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    gap: 2px;
    width: 144px;
    height: 41px;
    background: rgba(46, 26, 84, 0.8);
    border-radius: 100px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
    border: none;
    option {
        background: rgba(46, 26, 84, 0.8);
    }
`;

const searchBox = css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    gap: 15px;
    width: 320px;
    height: 41px;
    background: rgba(46, 26, 84, 0.8);
    border-radius: 100px;
    flex: none;
    order: 1;
    flex-grow: 0;
`;

const listProposals = css`
    width: 100%;
`;
