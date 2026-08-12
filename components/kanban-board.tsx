"use client";

import {
  IBoard,
  IColumn,
  IProgressApplication,
} from "@/lib/models/models.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Populated } from "@/lib/utils";
import CreateProgressDialog from "./create-progress-dialog";
import mongoose from "mongoose";
import {
  IProgressApplicationCardProps,
  ProgressApplicationCard,
} from "./progress-application-card";

export type PopulatedColumn = Populated<
  IColumn,
  "progressApplication",
  IProgressApplication[]
>;
export type PopulatedBoard = Populated<IBoard, "columns", PopulatedColumn[]>;
export interface IKanbanBoardProps {
  board: PopulatedBoard;
  userId: string;
}

export interface IColumnConfig {
  color: string;
  icon: ReactNode;
}

export interface IProgressCardProps {
  progress: Populated<IColumn, "progressApplication", IProgressApplication>;
}

const COLUMN_CONFIG: Array<IColumnConfig> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <Award className="h-4 w-4" />,
  },
];
function DroppableColumn({
  column,
  config,
  boardId,
  columns,
}: {
  column: PopulatedColumn;
  config: IColumnConfig;
  boardId: mongoose.Types.ObjectId;
  columns: PopulatedColumn[];
}) {
  // переделать на сложность O(n)
  const sortedProgress =
    column.progressApplication?.sort((a, b) => a.order - b.order) || [];
  return (
    <Card className="min-w-75 shrink-0 shadow-md p-0">
      <CardHeader
        className={`${config.color} text-white rounded-t-lg pb-3 pt-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-white text-base font-semibold">
              {column.name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant={"ghost"}
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20 aria-expanded:bg-white/30"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 bg-gray-50/50 min-h-100 rounded-b-lg">
        {sortedProgress.map((progress) => {
          return (
            <SortableProgressCard
              key={`${progress._id}`}
              progress={progress}
              columns={columns}
            />
          );
        })}
        <CreateProgressDialog
          columnId={column._id}
          boardId={boardId}
        ></CreateProgressDialog>
      </CardContent>
    </Card>
  );
}

function SortableProgressCard({
  progress,
  columns,
}: IProgressApplicationCardProps) {
  return (
    <div>
      <ProgressApplicationCard progress={progress} columns={columns} />
    </div>
  );
}

export default function KanbanBoard({ board, userId }: IKanbanBoardProps) {
  const columns = board.columns;
  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column, key) => {
            const config = COLUMN_CONFIG[key] || {
              color: "bg-gray-500",
              icon: <Calendar className="h-4 w-4" />,
            };
            return (
              <DroppableColumn
                key={key}
                column={column}
                config={config}
                boardId={board._id}
                columns={columns}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
