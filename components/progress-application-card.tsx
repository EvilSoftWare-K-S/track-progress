import { IProgressApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { PopulatedColumn } from "./kanban-board";

export interface IProgressApplicationCardProps {
  progress: IProgressApplication;
  columns: PopulatedColumn[];
}

export function ProgressApplicationCard({
  progress,
  columns,
}: IProgressApplicationCardProps) {
  console.log(progress);

  return (
    <>
      <Card className=" cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{progress.title}</h3>
              {progress.target && (
                <p className="text-xs text-muted-foreground mb-2">
                  {progress.target}
                </p>
              )}
              {progress.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {progress.description}
                </p>
              )}
              {progress.tags && progress.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {progress.tags.map((tag, key) => (
                    <span
                      key={key}
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {progress.url && (
                <a
                  target="_blank"
                  href={progress.url}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <div className="flex items-start gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={(props) => (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      {...props}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {columns.length > 1 && (
                    <>
                      {columns.map((column) => {
                        return column._id !== progress.columnId ? (
                          <DropdownMenuItem
                            key={`${column._id}`}
                            className={"focus:bg-gray-200 "}
                          >
                            Move to {column.name}
                          </DropdownMenuItem>
                        ) : null;
                      })}
                    </>
                  )}
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
