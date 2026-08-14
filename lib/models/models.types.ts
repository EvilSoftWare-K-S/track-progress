import mongoose, { Document } from "mongoose";

import { Types } from "mongoose";

export interface IBoard {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  userId: string;
  columns: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// export interface IBoard extends Document {
//   name: string;
//   slug: string;
//   userId: string;
//   columns: mongoose.Types.ObjectId[];
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface IColumn extends Document {
  name: string;
  boardId: mongoose.Types.ObjectId;
  order: number;
  progressApplication: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

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

export interface ICreateProgressDialog {
  columnId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
}
