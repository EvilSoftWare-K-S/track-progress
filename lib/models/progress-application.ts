import mongoose, { Schema } from "mongoose";
import { IProgressApplication } from "./models.types";

const ProgressApplicationSchema = new Schema<IProgressApplication>(
  {
    title: {
      type: String,
      required: true,
    },
    target: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: "applied",
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
    },
    rate: {
      type: String,
    },
    url: {
      type: String,
    },
    date: {
      type: Date,
    },
    tags: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.models.ProgressApplication ||
  mongoose.model<IProgressApplication>(
    "ProgressApplication",
    ProgressApplicationSchema,
  );
