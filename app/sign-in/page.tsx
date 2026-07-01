"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700" htmlFor="email">
                Email
              </Label>
              <Input
                className={
                  "border-gray-300 focus:border-primary focus:ring-primary"
                }
                id={"email"}
                type={"email"}
                placeholder="ivan@example.com"
                required
              ></Input>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700" htmlFor="password">
                Password
              </Label>
              <Input
                className={
                  "border-gray-300 focus:border-primary focus:ring-primary"
                }
                id={"password"}
                type={"password"}
                placeholder="Password"
                minLength={8}
                required
              ></Input>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className={"w-full bg-primary hover:bg-primary/90"}
              type="submit"
            >
              Sign In
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don`t have an account?{" "}
              <Link
                className="font-medium text-primary hover:underline"
                href="/sign-up"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
