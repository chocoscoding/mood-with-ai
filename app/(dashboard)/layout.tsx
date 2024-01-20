import { UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";

import Link from "next/link";

// Define the links for the sidebar
const links = [
  { name: "Journals", href: "/journal" },
  { name: "History", href: "/history" },
];


const DashboardLayout = ({ children }: { children: ReactNode }) => {

  return (
    <div className="w-screen h-screen relative">
      <aside className="absolute left-0 top-0 h-full w-[200px] border-r border-black/10">
        <div className="px-4 my-4">
          <span className="text-3xl">MOOD</span>
        </div>
        <div>
          <ul className="px-4">
            {/* Render the links in the sidebar */}
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.name}>
                <li className="text-xl my-4 bg-zinc-100 shadow-sm p-2.5 rounded-lg outline outline-black/10 cursor-pointer hover:outline-2 hover:outline-black/30 transition-all">
                  {link.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </aside>
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