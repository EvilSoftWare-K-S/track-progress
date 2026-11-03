import { Types } from "mongoose";
export type MongoId = Types.ObjectId | string;

export interface IBoard {
  _id: MongoId;
  name: string;
  slug: string;
  userId: string;
  columns: MongoId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IColumn {
  _id: MongoId;
  name: string;
  boardId: MongoId;
  order: number;
  progressApplication: IProgressApplication[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProgressApplication {
  _id: MongoId;
  title: string;
  target?: string;
  location?: string;
  status: string;
  columnId: MongoId;
  boardId: MongoId;
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
  columnId: MongoId;
  boardId: MongoId;
}
