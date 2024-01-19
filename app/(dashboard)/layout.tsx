import { UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-screen h-screen relative">
      <aside className="w-[200px] h-full absolute top-0 left-0 border-r border-black/10">Mood</aside>
      <div className="ml-[200px] h-full overflow-hidden">
        <header className="border-b border-black/10 h-[60px]">
          <div className="w-full h-full flex items-center justify-end px-6">
            <UserButton />
          </div>
        </header>
        <div className="h-[calc(100vh-60px)] overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
