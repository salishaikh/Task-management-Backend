import mongoose, { Schema } from "mongoose";

const boardschema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
});

export const Board = mongoose.model("Board", boardschema);
