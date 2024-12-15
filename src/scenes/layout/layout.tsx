import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import PlayBar from "./playbar/index";
import { Toaster } from "@/components/ui/toaster";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[200px] hidden md:block border-r">
          <Sidebar />
        </aside>
        <main className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
          <Toaster />
        </main>
      </div>
      <PlayBar />
    </div>
  );
};

export default Layout;

