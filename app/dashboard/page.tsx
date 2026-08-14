import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/auth";
import ConnectDB from "@/lib/db";
import { Board } from "@/lib/models";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type TBoardPreview = {
  _id: string;
  name: string;
  slug: string;
};

async function getBoards(userId: string | undefined): Promise<TBoardPreview[]> {
  "use cache";
  await ConnectDB();
  const boards = await Board.find(
    { userId },
    {
      name: 1,
      slug: 1,
    },
  ).lean();

  return boards.map((board) => ({
    _id: board._id.toString(),
    name: board.name,
    slug: board.slug,
  }));
}

async function DashboardPageWrapper() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const boards = await getBoards(session?.user.id ?? "");

  return (
    <div className="container mx-auto  px-4">
      <header className="flex h-16 items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/create">
          <Button>Create New Board</Button>
        </Link>
      </header>

      <section className=" py-8">
        {boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
            <div className="text-muted-foreground">
              <p className="mb-2 text-lg font-medium">No boards yet</p>
              <p className="text-sm">Create your first board to get started</p>
            </div>
            <Link href="/dashboard/create" className="mt-4">
              <Button>Create New Board</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boards.map((board) => {
              return (
                <Link
                  key={board._id.toString()}
                  href={`/dashboard/${board.slug}`}
                  className="group relative rounded-lg border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-card-foreground group-hover:text-primary">
                      {board.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {"->"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Click to open board
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashboardPageWrapper />
    </Suspense>
  );
}
