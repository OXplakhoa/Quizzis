import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type Props = {};

const Navbar = async (props: Props) => {
  const session = await getAuthSession();
  console.log(session);
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-50 h-fit border-b border-zinc-300 py-2">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            Quizzis
          </p>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <Link href="/room/create">
                <Button variant="outline" className="hidden sm:flex">
                  Tạo Phòng
                </Button>
              </Link>
              <Link href="/room/join">
                <Button variant="secondary" className="hidden sm:flex">
                  Tham Gia Phòng
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle className="mr-4" />
          <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              //Add TypeWritter effect here
              <SignInButton text="Sign In" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
