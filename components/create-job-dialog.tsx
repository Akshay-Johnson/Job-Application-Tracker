import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface CreateJobApplicationProps {
  columnId: string;
  boardId: string;
}

export default function CreateJobApplicationDialog({
  columnId,
  boardId,
}: CreateJobApplicationProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
          <Plus />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Job Application</DialogTitle>
        <DialogDescription>Track a new job application </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
