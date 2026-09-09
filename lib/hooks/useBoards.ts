"use client";

import { TPopulatedBoard, TPopulatedColumn } from "@/components/kanban-board";
import { useState } from "react";
export function useBoard(initialBoard?: TPopulatedBoard | null) {
  const [board, setBoard] = useState<TPopulatedBoard | null>(
    initialBoard || null,
  );
  const [columns, setColumns] = useState<TPopulatedColumn[]>(
    initialBoard?.columns || [],
  );
  const [error, setError] = useState<string | null>(null);

  async function moveProgress(
    progressApplicationId: string,
    newColumnId: string,
    newOrder: number,
  ) {}

 const updateBoardData = (newBoard: TPopulatedBoard) => {
    setBoard(newBoard);
    setColumns(newBoard.columns || []);
  };

  return { board, columns, error, moveProgress, updateBoardData };
}
