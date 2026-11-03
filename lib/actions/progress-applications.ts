"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import ConnectDB from "../db";
import { Board, Column, ProgressApplication } from "../models";
import { IBoard, IColumn, IProgressApplication } from "../models/models.types";
import { sameId } from "../utils";

export type IProgressApplicationData = Pick<
  IProgressApplication,
  | "title"
  | "target"
  | "location"
  | "columnId"
  | "boardId"
  | "notes"
  | "order"
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

// хрень какая то - переделать
export async function updateProgressApplication(
  id: IProgressApplication["_id"],
  updates: Partial<IProgressApplicationData>,
) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  await ConnectDB();

  const progressApplication: IProgressApplication | null =
    await ProgressApplication.findById(id);

  if (!progressApplication) {
    return { error: "Progress application not found" };
  }

  if (progressApplication.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const { columnId, order, ...otherUpdates } = updates;

  const board: IBoard | null = await Board.findOne({
    _id: otherUpdates.boardId ?? progressApplication.boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

  const updatesToApply: Partial<IProgressApplication> = otherUpdates;

  const currentColumnId = progressApplication.columnId;
  const nextColumnId = columnId ?? currentColumnId;
  const isMovingToDifferentColumn =
    columnId !== undefined && !sameId(columnId, currentColumnId);
  const shouldReindex =
    !("title" in updates) &&
    (isMovingToDifferentColumn || order !== undefined);

  if (isMovingToDifferentColumn) {
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { progressApplication: id },
    });
    await Column.findByIdAndUpdate(nextColumnId, {
      $push: { progressApplication: id },
    });
    updatesToApply.columnId = nextColumnId;
  }

  if (shouldReindex) {
    const siblings = await ProgressApplication.find({
      columnId: nextColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    const insertAt =
      order === undefined || order === null
        ? siblings.length
        : Math.max(0, Math.min(order, siblings.length));

    updatesToApply.order = insertAt * 100;

    await Promise.all(
      siblings.map((progress, idx) => {
        const newIndex = idx >= insertAt ? idx + 1 : idx;
        return ProgressApplication.findByIdAndUpdate(progress._id, {
          $set: { order: newIndex * 100 },
        });
      }),
    );
  }

  const updated = await ProgressApplication.findByIdAndUpdate(
    id,
    updatesToApply,
    { returnDocument: "after" },
  );

  revalidatePath(`/dashboard/${board.slug}`);
  return { data: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteProgressApplication(
  id: IProgressApplication["_id"],
) {
  const session = await getSession();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const progressApplication: IProgressApplication | null =
    await ProgressApplication.findById(id);

  if (!progressApplication) {
    return { error: "Progress application not found" };
  }

  if (progressApplication.userId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const board: IBoard | null = await Board.findOne({
    _id: progressApplication.boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

  await Column.findByIdAndUpdate(progressApplication.columnId, {
    $pull: { progressApplication: id },
  });

  await ProgressApplication.deleteOne({ _id: id });

  revalidatePath(`/dashboard/${board.slug}`);
  return { success: true };
}
