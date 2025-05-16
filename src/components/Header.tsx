
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 bg-brand-dark-gray">
      <div className="text-brand-red font-bold text-2xl">upGrad</div>
      <Avatar className="h-10 w-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
