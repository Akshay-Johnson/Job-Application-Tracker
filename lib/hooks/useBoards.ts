"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.type";
import { useEffect, useState } from "react";
import { updateJobApplication } from "../actions/job-application";

export function useBoard(initialBoard?: Board | null) {
  const [board, setBoard] = useState<Board | null>(initialBoard || null);
  const [columns, setColumns] = useState<Column[]>(initialBoard?.columns || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBoard) {
      setBoard(initialBoard);
      setColumns(initialBoard.columns);
    }
  }, [initialBoard]);

  async function moveJob(
    jobApplication: string,
    newColumnId: string,
    newOrder: number,
  ) {
    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        jobApplications: [...col.jobApplications],
      }));

      let jobToMove: JobApplication | null = null;
      let oldColumnId: string | null = null;

      for (const column of newColumns) {
        const jobIndex = column.jobApplications.findIndex(
          (job) => job._id === jobApplication,
        );
        if (jobIndex !== -1) {
          jobToMove = column.jobApplications[jobIndex];
          oldColumnId = column._id;
          column.jobApplications = column.jobApplications.filter(
            (job) => job._id !== jobApplication,
          );
          break;
        }
      }

      if (!jobToMove || !oldColumnId) {
        return newColumns;
      }

      const targetColumnIndex = newColumns.findIndex(
        (col) => col._id === newColumnId,
      );
      if (targetColumnIndex === -1) {
        return newColumns;
      }

      const targetColumn = newColumns[targetColumnIndex];
      const currentJobs = targetColumn.jobApplications || [];

      const updatedJobs = [...currentJobs];
      updatedJobs.splice(newOrder, 0, {
        ...jobToMove,
        columnId: newColumnId,
        order: newOrder * 100,
      });

      const jobWithUpdatedOrder = updatedJobs.map((job, index) => ({
        ...job,
        order: index * 100,
      }));

      newColumns[targetColumnIndex] = {
        ...targetColumn,
        jobApplications: jobWithUpdatedOrder,
      };

      return newColumns;
    });
    try {
      const result = await updateJobApplication(jobApplication, {
        columnId: newColumnId,
        order: newOrder,
      });
      

    }catch (error) {
      console.error("Error moving job application:", error);
      setError("Failed to move job application. Please try again.");
    }
  }

  return {
    board,
    columns,
    error,
    moveJob,
  };
}
