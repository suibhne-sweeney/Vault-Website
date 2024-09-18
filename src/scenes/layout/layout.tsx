import React, { ReactNode } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface LayoutProps{
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return(
    <>
      <div className="grid grid-cols-6 h-screen">
        <div className="col-span-1 border-x">
          <Sidebar />
        </div>
        <div className="col-span-5">
          <Navbar />
          {children}
        </div>
      </div>

    </>
  )
}

export default Layout;