import { HouseWifiIcon, WifiIcon } from "lucide-react";
import { SidebarLink } from "./SidebarLinks";

const sidebarLinks = [
  {
    path: "/",
    label: "Dashboard",
    icon: <WifiIcon />,
  },
  {
    path: "/saved",
    label: "Saved Networks",
    icon: <HouseWifiIcon />,
  },
];

export default function Sidebar() {
  return (
    <div className="text-white h-full p-4 pt-6 border-r-3 border-stone-900 min-w-96 max-w-96">
      <ul className="space-y-3">
        {sidebarLinks.map(({ path, icon, label }) => {
          return (
            <li key={path}>
              <SidebarLink to={path}>
                {icon}
                {label}
              </SidebarLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
