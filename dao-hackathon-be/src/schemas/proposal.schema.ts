import mongoose, { Schema } from "mongoose";
import { State } from "bupbethuytinh";
import { Voter } from "@constants";

export interface IProposal {
  proposal_id: string;
  proposal_name: string;
  proposal_state: State;
  issued_by: string;
  start_date: number;
  end_date: number;
  against_votes: number;
  for_votes: number;
  abstain_votes: number;
  description: string;
  total_votes: number;
  total_address: number;
  voters: Voter[];
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

const proposalSchema = new Schema<IProposal>({
  proposal_id: { type: String, required: true, unique: true },
  proposal_name: { type: String, required: true, default: "Mesme Proposal" },
  proposal_state: {
    type: Schema.Types.Mixed,
    required: true,
    default: State.Pending,
  },
  issued_by: { type: String, required: true },
  start_date: { type: Number, required: false },
  end_date: { type: Number, required: false },
  against_votes: { type: Number, required: false, default: 0 },
  for_votes: { type: Number, required: false, default: 0 },
  abstain_votes: { type: Number, required: false, default: 0 },
  description: { type: String, required: false, default: "" },
  voters: { type: Schema.Types.Mixed, required: false, default: [] },
  created_at: { required: false, type: Date, default: Date.now },
  total_votes: { type: Number, required: false, default: 0 },
  total_address: { type: Number, required: false, default: 0 },
  updated_at: { required: false, type: Date },
  deleted_at: { required: false, type: Date },
});

export const Proposal = mongoose.model("proposal", proposalSchema, undefined, {
  overwriteModels: true,
});
