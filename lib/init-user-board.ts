import dbConnect from "./db";
import { Board, Column } from "./models";
import column from "./models/column";
import jobApplication from "./models/job-application";

const DEFAULT_COLUMNS = [
  {
    name: "wishlist",
    order: 0,
  },
  {
    name: "applied",
    order: 1,
    },
  {name: "interviewing",
    order: 2,
    },
    {name: "offer",
    order: 3,
    },
    {name: "rejected",
    order: 4,
    },
];

export async function initUserBoard(userId: string) {
  try {
    await dbConnect();
    // Check if the user already has a board
    const existingBoard = await Board.findOne({ userId, name: "Job Hunt" });
    if (existingBoard) {
      console.log("User already has a board:", existingBoard._id);
      return existingBoard;
    }

    // Create a new board for the user
    const board = await Board.create({
      name: "Job Hunt",
      userId,
      columns: [],
    });
      // Create default columns
      const columns = await Promise.all(
          DEFAULT_COLUMNS.map((col) => Column.create({
              name: col.name,
              order: col.order,
              boardId: board._id,
              jobApplications: [],
          }))
      );
      // Update the board with the created columns
      board.columns = columns.map((col) => col._id);
      await board.save();
      return board;
      

  } catch (error) {
    console.error("Error initializing user board:", error);
    throw error;
  }
}
