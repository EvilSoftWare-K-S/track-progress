"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import SignOutButton from "./sign-out-button";
import { useSession } from "@/lib/auth/auth-client";

export default function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <Briefcase />
          Progress Tracker
        </Link>

        <div className="flex items-center gap-4">
          {isPending ? (
            <>
              <div className="h-10 w-28 animate-pulse rounded-md bg-gray-200" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            </>
          ) : session?.user ? (
            <>
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant={"ghost"} size="icon">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-white">
                          {session.user.name[0].toLocaleUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  }
                />
                <DropdownMenuContent className="w-60" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <div>
                        <p>{session.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <SignOutButton />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Log In
                </Button>
              </Link>

              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90">
                  Start for free
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
