"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LogOut, Home, User as UserIcon, Settings } from "lucide-react";
import UserAvatar from "./UserAvatar";

type Props = {
  user: Pick<User, "name" | "email" | "image">;
};

const UserAccountNav = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none cursor-pointer transition-transform hover:scale-105">
          <UserAvatar user={user} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && (
              <p className="font-semibold text-gray-900 dark:text-white">
                {user.name}
              </p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-gray-600 dark:text-gray-300">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          <Link href="/" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <UserIcon className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
          <Link href="/settings" className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Settings className="w-4 h-4" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut().catch(console.error);
          }}
          className="text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <div className="flex items-center gap-2">
            <span>Đăng xuất</span>
            <LogOut className="w-4 h-4" />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
