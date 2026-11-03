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
import { ReactNode, useEffect, useId, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Populated, sameId } from "@/lib/utils";
import CreateProgressDialog from "./create-progress-dialog";
import {
  IProgressApplicationCardProps,
  ProgressApplicationCard,
} from "./progress-application-card";
import { useBoard } from "@/lib/hooks/useBoards";
import {
  closestCorners,
  CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type TPopulatedColumn = Populated<
  IColumn,
  "progressApplication",
  IProgressApplication[]
>;
export type TPopulatedBoard = Populated<IBoard, "columns", TPopulatedColumn[]>;
export interface IKanbanBoardProps {
  board: TPopulatedBoard;
  userId: string;
}

export interface IColumnConfig {
  color: string;
  icon: ReactNode;
}

export interface IProgressCardProps {
  progress: Populated<IColumn, "progressApplication", IProgressApplication>;
}

const collisionDetection: CollisionDetection = (args) => {
  const pointerHits = pointerWithin(args);
  const collisions =
    pointerHits.length > 0 ? pointerHits : closestCorners(args);

  const cardCollision = collisions.find((collision) => {
    const container = args.droppableContainers.find(
      (droppable) => droppable.id === collision.id,
    );
    return container?.data.current?.type === "progress";
  });

  if (cardCollision) {
    return [cardCollision];
  }

  return collisions;
};

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
  column: TPopulatedColumn;
  config: IColumnConfig;
  boardId: IBoard["_id"];
  columns: TPopulatedColumn[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: String(column._id),
    data: {
      type: "column",
      columnId: column._id,
    },
  });
  return (
    <Card className="min-w-75 shrink-0 shadow-md p-0 rounded-t-lg">
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
      <CardContent
        className={`flex min-h-100 flex-col space-y-2 rounded-b-lg bg-gray-50/50 pt-4 ${isOver ? "ring-2 ring-blue-500" : ""}`}
      >
        <SortableContext
          items={column.progressApplication.map((progress) =>
            String(progress._id),
          )}
          strategy={verticalListSortingStrategy}
        >
          {column.progressApplication.map((progress) => {
            return (
              <SortableProgressCard
                key={`${progress._id}`}
                progress={progress}
                columns={columns}
              />
            );
          })}
        </SortableContext>

        <div ref={setNodeRef} className="flex min-h-12 flex-1 flex-col justify-end">
          <CreateProgressDialog
            columnId={column._id}
            boardId={boardId}
          ></CreateProgressDialog>
        </div>
      </CardContent>
    </Card>
  );
}

function SortableProgressCard({
  progress,
  columns,
}: IProgressApplicationCardProps) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: String(progress._id),
    data: { type: "progress", progress },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div style={style} ref={setNodeRef}>
      <ProgressApplicationCard
        progress={progress}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function KanbanBoard({ board, userId }: IKanbanBoardProps) {
  const dndContextId = useId();

  const [activeId, setActiveId] = useState<string | null>(null);
  const { columns, moveProgress, updateBoardData } = useBoard(board);

  const sortedProgress: TPopulatedColumn[] = columns.map((col) => ({
    ...col,
    progressApplication: [...(col.progressApplication || [])].sort(
      (a, b) => a.order - b.order,
    ),
  }));

  useEffect(() => {
    updateBoardData(board);
  }, [board, updateBoardData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  async function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !board._id) return;

    const draggedId = String(active.id);
    const overId = String(over.id);

    const sourceColumn = sortedProgress.find((column) =>
      column.progressApplication.some((progress) =>
        sameId(progress._id, draggedId),
      ),
    );
    if (!sourceColumn) return;

    const sourceIndex = sourceColumn.progressApplication.findIndex((progress) =>
      sameId(progress._id, draggedId),
    );

    const overType = over.data.current?.type;
    let targetColumnId: string;
    let newOrder: number;

    if (overType === "column" || sameId(overId, over.data.current?.columnId)) {
      targetColumnId = String(over.data.current?.columnId ?? overId);
      const targetColumn = sortedProgress.find((column) =>
        sameId(column._id, targetColumnId),
      );
      newOrder = (targetColumn?.progressApplication || []).filter(
        (progress) => !sameId(progress._id, draggedId),
      ).length;
    } else {
      const targetColumn = sortedProgress.find((column) =>
        column.progressApplication.some((progress) =>
          sameId(progress._id, overId),
        ),
      );
      if (!targetColumn) return;

      targetColumnId = String(targetColumn._id);
      const overIndex = targetColumn.progressApplication.findIndex((progress) =>
        sameId(progress._id, overId),
      );
      if (overIndex === -1) return;
      newOrder = overIndex;
    }

    if (sameId(sourceColumn._id, targetColumnId) && sourceIndex === newOrder) {
      return;
    }

    await moveProgress(draggedId, targetColumnId, newOrder);
  }

  const activeProgress = sortedProgress
    .flatMap((col) => col.progressApplication || [])
    .find((progress) => String(progress._id) === activeId);

  return (
    <DndContext
      id={dndContextId}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4 pl-1 pr-1">
          {/* <div className=" pb-4"> */}
          {sortedProgress.map((column, key) => {
            const config = COLUMN_CONFIG[key] || {
              color: "bg-gray-500",
              icon: <Calendar className="h-4 w-4" />,
            };
            return (
              <DroppableColumn
                key={String(column._id)}
                column={column}
                config={config}
                boardId={board._id}
                columns={sortedProgress}
              />
            );
          })}
        </div>
      </div>
      <DragOverlay>
        {activeProgress ? (
          <div className="opacity-50">
            <ProgressApplicationCard
              progress={activeProgress}
              columns={sortedProgress}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
