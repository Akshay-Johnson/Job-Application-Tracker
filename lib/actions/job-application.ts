"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import dbConnect from "../db";
import { Board, Column, JobApplication } from "../models";

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  salary?: string;
  jobUrl?: string;
  tags?: string[];
  description?: string;
  notes?: string;
  columnId: string;
  boardId: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  await dbConnect();

  const {
    company,
    position,
    location,
    salary,
    jobUrl,
    tags,
    description,
    notes,
    columnId,
    boardId,
  } = data;

  if (!company || !position || !columnId || !boardId) {
    throw new Error("Missing required fields");
  }

  //verify that the user has access to the board and column
  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    throw new Error("Board not found or access denied");
  }

  //verify that the column exists in the board
  const column = await Column.findOne({
    _id: columnId,
    boardId: boardId,
  });

  if (!column) {
    throw new Error("Column not found in the specified board");
  }

  const maxOrder = (await JobApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;

  const jobApplication = await JobApplication.create({
    company,
    position,
    location,
    salary,
    jobUrl,
    tags: tags || [],
    description,
    notes,
    userId: session.user.id,
    columnId,
    boardId,
    status: "applied",
    order: maxOrder ? maxOrder.order + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  revalidatePath("/dashboard");

  return { data: JSON.parse(JSON.stringify(jobApplication)) };
}

export async function updateJobApplication(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    salary?: string;
    jobUrl?: string;
    tags?: string[];
    description?: string;
    notes?: string;
    columnId?: string;
    order?: number;
  },
) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const jobApplication = await JobApplication.findOne({ _id: id }).lean();

  if (!jobApplication) {
    throw new Error("Job application not found");
  }

  if (jobApplication.userId !== session.user.id) {
    throw new Error("Access denied");
  }

  const { columnId, order, ...otherUpdates } = updates;
  const updateToApply: Partial<{
    company: string;
    position: string;
    location: string;
    salary: string;
    jobUrl: string;
    tags: string[];
    description: string;
    notes: string;
    columnId: string;
    order: number;
  }> = otherUpdates;

  const currentColumnId = jobApplication.columnId.toString();
  const newColumnId = columnId ? columnId.toString() : undefined;
  const isMovingToNewColumn = newColumnId && newColumnId !== currentColumnId;

  if (isMovingToNewColumn) {
    await Column.findByIdAndUpdate(currentColumnId, {
      $pull: { jobApplications: id },
    });

    const jobInTargetColumn = await JobApplication.findOne({
      columnId: newColumnId,
      _id: { $ne: id },
    })
      .sort({ order: -1 })
      .lean();
    let newOrderValue: number;

    if (order !== undefined && order !== null) {
      newOrderValue = order * 100;

      const jobsThatNeedToShift = jobInTargetColumn.slice(order);
      for (const job of jobsThatNeedToShift) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $inc: { order: job.order + 100 },
        });
      }
    } else {
      if (jobInTargetColumn.length > 0) {
        const lastJobOrder =
          jobInTargetColumn[jobInTargetColumn.length - 1].order || 0;
        newOrderValue = lastJobOrder + 100;
      } else {
        newOrderValue = 0;
      }
    }
    updateToApply.columnId = newColumnId;
    updateToApply.order = newOrderValue;

    await Column.findByIdAndUpdate(newColumnId, {
      $push: { jobApplications: id },
    });
  } else if (order !== undefined && order !== null) {
    const otherJobsInColumn = await JobApplication.find({
      columnId: currentColumnId,
      _id: { $ne: id },
    })
      .sort({ order: 1 })
      .lean();

    const currentJobOrder = jobApplication.order || 0;
    const currentPositionIndex = otherJobsInColumn.findIndex(
      (job) => job.order > currentJobOrder,
    );
    const oldPostionIndex =
      currentPositionIndex === -1
        ? otherJobsInColumn.length
        : currentPositionIndex;
    const newOrderValue = order * 100;
    if (order < oldPostionIndex) {
      const jobsToShiftDown = otherJobsInColumn.slice(order, oldPostionIndex);
      for (const job of jobsToShiftDown) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + 100 },
        });
      }
    } else if (order > oldPostionIndex) {
      const jobsToShiftUp = otherJobsInColumn.slice(oldPostionIndex, order);
      for (const job of jobsToShiftUp) {
        const newOrder = Math.max(0, job.order - 100);
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: newOrder },
        });
      }
    }
    updateToApply.order = newOrderValue;
  }

  const updated = await JobApplication.findByIdAndUpdate(id, updateToApply, {
    new: true,
  });
  revalidatePath("/dashboard");
  return { data: JSON.parse(JSON.stringify(updated)) };
}

export async function deleteJobApplication(id: string) {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    throw new Error("Job application not found");
  }

  if (jobApplication.userId !== session.user.id) {
    throw new Error("Access denied");
  }

  await Column.findByIdAndUpdate(jobApplication.columnId, {
    $pull: { jobApplications: id },
  });

  await JobApplication.deleteOne({ _id: id });
  revalidatePath("/dashboard");
  return { data: { success: true } };
}
