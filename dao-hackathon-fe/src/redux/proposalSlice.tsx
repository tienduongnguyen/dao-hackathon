import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface ListProposalState {
    value: any
}

const initialState: ListProposalState = {
    value: []
}

export const proposalSlice = createSlice({
    name: 'listProposal',
    initialState,
    reducers: {
        getListProposal: (state, action: PayloadAction<any>) => {
            state.value = action.payload
        }
    }
})

export const {getListProposal} = proposalSlice.actions
export default proposalSlice.reducer

