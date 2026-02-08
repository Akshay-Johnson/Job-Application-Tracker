import { getSession } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { Board } from "@/lib/models";
import board from "@/lib/models/board";
import { Kanban } from "lucide-react";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/kaban-board";

export default async function dashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  await dbConnect();

  const board = await Board.findOne({
    userId: session.user.id,
    name : "Job Hunt"
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications",
    },

  })

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">{board.name}</h1> 
          <p className="text-gray-600"> Track your job applications </p>
        </div>
        <KanbanBoard board={JSON.parse(JSON.stringify(board))} userId={session.user.id} />
      </div>
   </div>
  );
}
