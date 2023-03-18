import { combineReducers } from "@reduxjs/toolkit";
import accountSlice from "./accountSlice";
import delegateSlice from "./delegateSlice";
import proposalSlice from "./proposalSlice";

export const reducer = combineReducers({
  listProposal: proposalSlice,
  delegate: delegateSlice,
  account: accountSlice
});
