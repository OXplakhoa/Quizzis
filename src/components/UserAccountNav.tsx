"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import UserAvatar from "./UserAvatar";

type Props = {
  user: Pick<User, "name" | "email" | "image">;
};

const UserAccountNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* User avatar */}
        <button className="rounded-full focus:outline-none cursor-pointer">
          <UserAvatar user={user} />
        </button>
        {/* <h1>Hi</h1> */}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-white">
        <div className="flex items-center justify-start gap-2 mb-5">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Homepage</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut().catch(console.error);
          }}
          className="text-red-600 cursor-pointer mt-3"
        >
          <div className="flex items-center gap-2">
            <span>Sign out</span>
            <LogOut className="w-4 h-4" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
