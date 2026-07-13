"use client";
import { ICreateProgressDialog } from "@/lib/models/models.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";
import { createProgressApplication } from "@/lib/actions/progress-applications";

export default function CreateProgressDialog({
  columnId,
  boardId,
}: ICreateProgressDialog) {
  const INITIAL_FORM_DATA = {
    title: "",
    target: "",
    location: "",
    rate: "",
    url: "",
    tags: "",
    description: "",
    notes: "",
  };
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    try {
      const result = await createProgressApplication({
        ...formData,
        columnId,
        boardId,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });
      if (!result.error) {
        setFormData(INITIAL_FORM_DATA);
        setOpen(false);
      } else {
        console.error("Failed to create");
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            className="w-full mb-4 justify-start text-muted-foreground"
            variant="outline"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Goal</DialogTitle>
          <DialogDescription>Track a new goal</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
