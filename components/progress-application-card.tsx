"use client";

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
import { TPopulatedColumn } from "./kanban-board";
import {
  deleteProgressApplication,
  updateProgressApplication,
} from "@/lib/actions/progress-applications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

export interface IProgressApplicationCardProps {
  progress: IProgressApplication;
  columns: TPopulatedColumn[];
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export function ProgressApplicationCard({
  progress,
  columns,
  dragHandleProps,
}: IProgressApplicationCardProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: progress.title || "",
    target: progress.target || "",
    location: progress.location || "",
    status: progress.status || "",
    columnId: progress.columnId || "",
    boardId: progress.boardId || "",
    userId: progress.userId || "",
    order: progress.order || 0,
    notes: progress.notes || "",
    rate: progress.rate || "",
    url: progress.url || "",
    tags: progress.tags?.join(", ") || "",
    description: progress.description || "",
  });

  async function handleUpdate(e: React.SubmitEvent) {
    e.preventDefault();
    try {
      const result = await updateProgressApplication(progress._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      if (!result.error) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to move progress application: ", err);
    }
  }

  async function handleDelete() {
    try {
      const result = await deleteProgressApplication(progress._id);
      if (result.error) {
        console.error("Failed to delete progress application ", result.error);
      }
    } catch (err) {
      console.error("Failed to delete progress application ", err);
    }
  }

  async function handleMove(column: TPopulatedColumn) {
    try {
      const result = await updateProgressApplication(progress._id, {
        boardId: column.boardId,
        columnId: column._id,
      });
      if (result.error) {
        console.error("Failed to move progress application: ", result.error);
      }
    } catch (err) {
      console.error("Failed to move progress application: ", err);
    }
  }

  return (
    <>
      <Card className=" cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm" {...dragHandleProps}>
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
                  <DropdownMenuItem
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
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
                            onClick={() => {
                              handleMove(column);
                            }}
                          >
                            Move to {column.name}
                          </DropdownMenuItem>
                        ) : null;
                      })}
                    </>
                  )}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
            <DialogDescription>Track a new goal</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target</Label>
                  <Input
                    id="target"
                    value={formData.target}
                    onChange={(e) =>
                      setFormData({ ...formData, target: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Rate</Label>
                  <Input
                    id="rate"
                    placeholder="e.g., $100k - $150k or 5 / 10"
                    value={formData.rate}
                    onChange={(e) =>
                      setFormData({ ...formData, rate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="url">Url</Label>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="Travelling, Skills, Dream..."
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the goal..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes </Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
