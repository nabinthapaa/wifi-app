import { Outlet } from "react-router";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/sidebar/Sidebar";

export default function Layout() {
  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Sidebar />
      <div>
        <Header />
        <div className="p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
