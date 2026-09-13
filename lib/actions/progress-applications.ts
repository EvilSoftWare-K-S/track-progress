"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import ConnectDB from "../db";
import { Board, Column, ProgressApplication } from "../models";
import { IBoard, IColumn, IProgressApplication } from "../models/models.types";

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
    _id: otherUpdates.boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

  // сузить тип до примитивов
  const updatesToApply: Partial<IProgressApplication> = otherUpdates;

  const currentColumnId = progressApplication.columnId;
  const newColumnId = columnId;

  const isMovingToDifferentColumn =
    newColumnId && newColumnId !== currentColumnId;

  if (isMovingToDifferentColumn) {
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { progressApplication: id },
    });

    const progressInTargetColumn = await ProgressApplication.find({
      columnId: newColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    let newOrderValue: number;
    if (order !== undefined && order !== null) {
      newOrderValue = order * 100;

      const progressThatNeedToShift = progressInTargetColumn.slice(order);

      for (const progress of progressThatNeedToShift) {
        await ProgressApplication.findByIdAndUpdate(progress._id, {
          $set: { order: progress.order + 100 },
        });
      }
    } else {
      if (progressInTargetColumn.length > 0) {
        const lastProgressOrder =
          progressInTargetColumn[progressInTargetColumn.length - 1].order || 0;
        newOrderValue = lastProgressOrder + 100;
      } else {
        newOrderValue = 0;
      }
    }

    updatesToApply.columnId = newColumnId;
    updatesToApply.order = newOrderValue;

    await Column.findByIdAndUpdate(newColumnId, {
      $push: { progressApplication: id },
    });
  } else if (order !== undefined && order !== null) {
    const otherProgressInColumn = await ProgressApplication.find({
      columnId: currentColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    const currentProgressOrder = progressApplication.order || 0;

    const currentPositionIndex = otherProgressInColumn.findIndex(
      (progress) => progress.order > currentProgressOrder,
    );
    const oldPositionIndex =
      currentPositionIndex === -1
        ? otherProgressInColumn.length
        : currentPositionIndex;

    const newOrderValue = order * 100;

    if (order < oldPositionIndex) {
      const progressToShiftDown = otherProgressInColumn.slice(
        order,
        oldPositionIndex,
      );
      for (const progress of progressToShiftDown) {
        await ProgressApplication.findByIdAndUpdate(progress._id, {
          $set: {
            order: progress.order + 100,
          },
        });
      }
    } else if (order > oldPositionIndex) {
      const progressToShiftUp = otherProgressInColumn.slice(
        oldPositionIndex,
        order,
      );
      for (const progress of progressToShiftUp) {
        const newOrder = Math.max(0, progress.order - 100);
        await ProgressApplication.findByIdAndUpdate(progress._id, {
          $set: {
            order: newOrder,
          },
        });
      }
    }
    updatesToApply.order = newOrderValue;
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
  id: Pick<IProgressApplication, "_id">,
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
