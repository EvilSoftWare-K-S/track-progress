import mongoose, { Schema, Document } from "mongoose";

export interface IProgressApplication extends Document {
  title: string;
  target?: string;
  location?: string;
  status: string;
  columnId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  userId: string;
  order: number;
  notes?: string;
  rate?: string;
  url?: string;
  date?: Date;
  tags?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
