"use client";

import { TPopulatedBoard, TPopulatedColumn } from "@/components/kanban-board";
import { useState } from "react";
import { IColumn, IProgressApplication } from "../models/models.types";
import { updateProgressApplication } from "../actions/progress-applications";
export function useBoard(initialBoard?: TPopulatedBoard | null) {
  const [board, setBoard] = useState<TPopulatedBoard | null>(
    initialBoard || null,
  );
  const [columns, setColumns] = useState<TPopulatedColumn[]>(
    initialBoard?.columns || [],
  );
  const [error, setError] = useState<string | null>(null);

  async function moveProgress(
    progressApplicationId: IProgressApplication["_id"],
    newColumnId: IColumn["_id"],
    newOrder: number,
  ) {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        progressApplication: [...col.progressApplication],
      }));

      let progressToMove: IProgressApplication | null = null;
      let oldColumnId: IProgressApplication["_id"] | null = null;

      for (const col of newColumns) {
        const progressIndex = col.progressApplication.findIndex(
          (p) => p._id === progressApplicationId,
        );
        if (progressIndex !== -1 && progressIndex !== undefined) {
          progressToMove = col.progressApplication[progressIndex];
          oldColumnId = col._id;
          col.progressApplication = col.progressApplication.filter(
            (progress) => progress._id !== progressApplicationId,
          );
          break;
        }
      }

      if (progressToMove && oldColumnId) {
        const targetColumnIndex = newColumns.findIndex(
          (col) => col._id === newColumnId,
        );
        if (targetColumnIndex !== -1) {
          const targetColumn = newColumns[targetColumnIndex];
          const currentProgress = targetColumn.progressApplication || [];

          const updatedProgress = [...currentProgress];
          updatedProgress.splice(newOrder, 0, {
            ...progressToMove,
            columnId: newColumnId,
            order: newOrder * 100,
          });

          const progressWithUpdatedOrders = updatedProgress.map(
            (progress, idx) => ({
              ...progress,
              order: idx * 100,
            }),
          );

          newColumns[targetColumnIndex] = {
            ...targetColumn,
            progressApplication: progressWithUpdatedOrders,
          };
        }
      }

      return newColumns;
    });

    try {
      const result = await updateProgressApplication(progressApplicationId, {
        boardId:board?._id,
        columnId: newColumnId,
        order: newOrder,
      });
    } catch (err) {
      console.error("Error", err);
    }
  }
  const updateBoardData = (newBoard: TPopulatedBoard) => {
    setBoard(newBoard);
    setColumns(newBoard.columns || []);
  };

  return { board, columns, error, moveProgress, updateBoardData };
}
