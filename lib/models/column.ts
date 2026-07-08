import mongoose, { Schema, Document } from "mongoose";

export interface IColumn extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  progressApplication: mongoose.Types.ObjectId[];
  created: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    name: {
      type: String,
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    progressApplication: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProgressApplication",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.Column ||
  mongoose.model<IColumn>("Column", ColumnSchema);
