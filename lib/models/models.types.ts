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

export interface IColumn {
  _id: Types.ObjectId;
  name: string;
  boardId: Types.ObjectId;
  order: number;
  progressApplication: IProgressApplication[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgressApplication {
  _id: Types.ObjectId;
  title: string;
  target?: string;
  location?: string;
  status: string;
  columnId: Types.ObjectId;
  boardId: Types.ObjectId;
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
  columnId: Types.ObjectId;
  boardId: Types.ObjectId;
}
