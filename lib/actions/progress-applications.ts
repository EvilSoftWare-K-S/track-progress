"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import ConnectDB from "../db";
import { Board, Column, ProgressApplication } from "../models";
import { IBoard, IColumn, IProgressApplication } from "../models/models.types";

type IProgressApplicationData = Pick<
  IProgressApplication,
  | "title"
  | "target"
  | "location"
  | "columnId"
  | "boardId"
  | "notes"
  | "rate"
  | "url"
  | "description"
  | "tags"
  | "date"
>;

export async function createProgressApplication(
  data: IProgressApplicationData,
) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await ConnectDB();

  const {
    title,
    target,
    location,
    columnId,
    boardId,
    notes,
    rate,
    url,
    tags,
    description,
  } = data;
  if (!title || !columnId || !boardId) {
    return { error: "Missing reqires fields" };
  }

  const board: IBoard | null = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

  const column: IColumn | null = await Column.findOne({
    _id: columnId,
    boardId: boardId,
  });

  if (!column) {
    return { error: "Column not found" };
  }

  const maxOrder = (await ProgressApplication.findOne({ columnId })
    .sort({
      order: -1,
    })
    .select("order")
    .lean()) as { order: number } | null;

  const progressApplication = await ProgressApplication.create({
    title,
    target,
    location,
    columnId,
    boardId,
    notes,
    rate,
    url,
    userId: session.user.id,
    tags: tags || [],
    description,
    status: column.name,
    order: maxOrder ? maxOrder.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { progressApplication: progressApplication._id },
  });
  revalidatePath(`/dashboard/${board.slug}`);
  return { data: JSON.parse(JSON.stringify(progressApplication)) };
}
