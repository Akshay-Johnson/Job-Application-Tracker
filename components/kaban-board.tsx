"use client";

import column from "@/lib/models/column";
import { Board, Column } from "@/lib/models/models.type";
import {
  Award,
  CalendarHeart,
  CheckCircle2,
  Mic,
  MoreHorizontal,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

interface ColumnConfig {
  color: string;
  icon: React.ReactNode;
}

const COLUMN_CONFIG: Array<ColumnConfig> = [
  { color: "bg-blue-400", icon: <CalendarHeart className="h-4 w-4" /> },
  { color: "bg-blue-600", icon: <CheckCircle2 className="h-4 w-4" /> },
  { color: "bg-green-500", icon: <Mic className="h-4 w-4" /> },
  { color: "bg-yellow-400", icon: <Award className="h-4 w-4" /> },
  { color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
];

function DroppableColumn({
  column,
  config,
  boardId,
}: {
  column: Column;
  config: ColumnConfig;
  boardId: string;
}) {
  return (
    <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0">
      <CardHeader className={`${config.color} text-white rounded-lg pb-3 pt-3`}>
        <div className="flex item-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-white text-base font-semibold">
              {column.name}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 bg-gray-50/50 min-h-[400px] rounded-b-lg">
        <CreateJobApplicationDialog
          columnId={column._id}
          boardId={boardId}
        ></CreateJobApplicationDialog>
      </CardContent>
    </Card>
  );
}

export default function KabanBoard({ board, userId }: KanbanBoardProps) {
  const columns = board.columns;

  return (
    <>
      <div>
        <div>
          {columns.map((col, key) => {
            const config = COLUMN_CONFIG[key] || {
              color: "gray",
              icon: <CalendarHeart className="h-4 w-4" />,
            };
            return (
              <DroppableColumn
                key={key}
                column={col}
                config={config}
                boardId={board._id}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
