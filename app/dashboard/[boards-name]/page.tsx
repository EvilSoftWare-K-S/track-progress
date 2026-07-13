import KanbanBoard from "@/components/kanban-board";
import { getSession } from "@/lib/auth/auth";
import ConnectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { Button } from "@base-ui/react/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ "boards-name": string }>;
}) {
  const { "boards-name": boardsName } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  await ConnectDB();
  const board = await Board.findOne({
    userId: session.user.id,
    slug: boardsName,
  }).populate({ path: "columns" });
  return (
    <div className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-black">{board.name}</h1>
        <p className="text-gray-600">Track your progress</p>
        <Link href="/dashboard/create">
          <Button>Create New Column</Button>
        </Link>
      </header>
      <KanbanBoard
        board={JSON.parse(JSON.stringify(board))}
        userId={session.user.id}
      />
    </div>
  );
}
