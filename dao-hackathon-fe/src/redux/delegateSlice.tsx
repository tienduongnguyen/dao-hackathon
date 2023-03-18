import { createSlice, PayloadAction } from "@reduxjs/toolkit"


interface DelegateState {
    value: string
}

const initialState: DelegateState = {
    value: ""
}

export const delegateSlice = createSlice({
    name: 'delegate',
    initialState, 
    reducers: {
        setDelegate: (state, action: PayloadAction<string>) => {
            state.value = action.payload
        }
    }
})

export const {setDelegate} = delegateSlice.actions
export default delegateSlice.reducer