import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "next-auth";
import Image from "next/image";
import React from "react";

type Props = {
  user: Pick<User, "name" | "image">;
};

const UserAvatar = ({ user }: Props) => {
  return (
    <Avatar>
  {user.image ? (
    <div className="relative w-10 h-10"> 
      <Image
        fill
        src={user.image}
        alt="Profile Picture"
        referrerPolicy="no-referrer"
        className="object-cover rounded-full"
        sizes="100%"
        priority
      />
    </div>
  ) : (
    <AvatarFallback>
      <span className="sr-only">{user?.name}</span>
    </AvatarFallback>
  )}
</Avatar>

  );
};

export default UserAvatar;
