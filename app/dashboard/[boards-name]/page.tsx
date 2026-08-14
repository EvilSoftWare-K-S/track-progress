import KanbanBoard, { PopulatedBoard } from "@/components/kanban-board";
import { getSession } from "@/lib/auth/auth";
import ConnectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { Button } from "@base-ui/react/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getBoard(
  userId: string,
  boardsName: string,
): Promise<PopulatedBoard> {
  "use cache";
  await ConnectDB();

  const board = await Board.findOne({
    userId: userId,
    slug: boardsName,
  })
    .populate({
      path: "columns",
      populate: {
        path: "progressApplication",
      },
    })
    .lean();

  return JSON.parse(JSON.stringify(board));
}

async function BoardContent({ boardsName }: { boardsName: string }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }
  const board = await getBoard(session.user.id, boardsName);
  // await ConnectDB();

  // const board = await Board.findOne({
  //   userId: session.user.id,
  //   slug: boardsName,
  // }).populate({
  //   path: "columns",
  //   populate: {
  //     path: "progressApplication",
  //   },
  // });

  if (!board) {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-black">{board.name}</h1>
        <p className="text-gray-600">Track your progress</p>
        <Link href={`/dashboard/${boardsName}/create`}>
          <Button>Create New Column</Button>
        </Link>
      </header>
      <KanbanBoard board={board} userId={session.user.id} />
    </div>
  );
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ "boards-name": string }>;
}) {
  const { "boards-name": boardsName } = await params;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BoardContent boardsName={boardsName} />
    </Suspense>
  );
}
