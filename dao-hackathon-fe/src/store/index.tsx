import { createGlobalState } from 'react-hooks-global-state'
 

interface StateGlobal {
  connectedAccount: string,
  balance: string | number,
  chainId: string | number,
  chainName: string,
  totalStaked: string | number,
  totalVotingReward: string | number,  
}
const { setGlobalState, useGlobalState, getGlobalState } = createGlobalState<StateGlobal>({
  connectedAccount: '',
  balance: '',
  chainId: 0,
  chainName: '',
  totalStaked: 0,
  totalVotingReward: 0,  
})

export {
  setGlobalState,
  useGlobalState,
  getGlobalState,
}
