"use client";

import { TPopulatedBoard, TPopulatedColumn } from "@/components/kanban-board";
import { useCallback, useState } from "react";
import { IColumn, IProgressApplication } from "../models/models.types";
import { updateProgressApplication } from "../actions/progress-applications";
import { sameId } from "../utils";

function moveItemInColumns(
  columns: TPopulatedColumn[],
  progressId: IProgressApplication["_id"],
  targetColumnId: IColumn["_id"],
  toIndex: number,
): TPopulatedColumn[] {
  let item: IProgressApplication | undefined;
  let sourceColumnId: IColumn["_id"] | undefined;

  const withoutItem = columns.map((col) => {
    const sorted = [...(col.progressApplication || [])].sort(
      (a, b) => a.order - b.order,
    );
    const idx = sorted.findIndex((p) => sameId(p._id, progressId));
    if (idx === -1) {
      return col;
    }
    item = sorted[idx];
    sourceColumnId = col._id;
    return {
      ...col,
      progressApplication: sorted.filter((p) => !sameId(p._id, progressId)),
    };
  });

  if (!item) {
    return columns;
  }

  const movedItem = item;

  return withoutItem.map((col) => {
    const isTarget = sameId(col._id, targetColumnId);
    const isSource = sameId(col._id, sourceColumnId);
    if (!isTarget && !isSource) {
      return col;
    }

    const list = [...col.progressApplication].sort((a, b) => a.order - b.order);
    if (isTarget) {
      const insertAt = Math.max(0, Math.min(toIndex, list.length));
      list.splice(insertAt, 0, { ...movedItem, columnId: col._id });
    }

    return {
      ...col,
      progressApplication: list.map((progress, idx) => ({
        ...progress,
        order: idx * 100,
      })),
    };
  });
}

export function useBoard(initialBoard?: TPopulatedBoard | null) {
  const [board, setBoard] = useState<TPopulatedBoard | null>(
    initialBoard || null,
  );
  const [columns, setColumns] = useState<TPopulatedColumn[]>(
    initialBoard?.columns || [],
  );
  const [error, setError] = useState<string | null>(null);

  const updateBoardData = useCallback((newBoard: TPopulatedBoard) => {
    setBoard(newBoard);
    setColumns(newBoard.columns || []);
  }, []);

  const moveProgress = useCallback(
    async (
      progressApplicationId: IProgressApplication["_id"],
      newColumnId: IColumn["_id"],
      newOrder: number,
    ) => {
      setColumns((prev) =>
        moveItemInColumns(prev, progressApplicationId, newColumnId, newOrder),
      );

      try {
        await updateProgressApplication(progressApplicationId, {
          boardId: board?._id,
          columnId: newColumnId,
          order: newOrder,
        });
      } catch (err) {
        console.error("Error", err);
        setError("Failed to move card");
      }
    },
    [board],
  );

  return { board, columns, error, moveProgress, updateBoardData };
}
