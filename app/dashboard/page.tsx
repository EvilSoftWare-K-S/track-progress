import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/auth";
import ConnectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { generateSlug } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashBoard() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  await ConnectDB();
  const boards = await Board.find({ userId: session.user.id });

  return (
    <>
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/dashboard/create">
          <Button>Create New Board</Button>
        </Link>
      </header>

      <section className="container mx-auto px-4 py-8">
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
              const slug = generateSlug(board.name);
              return (
                <Link
                  key={board._id.toString()}
                  href={`/dashboard/${slug}`}
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
    </>
  );
}
