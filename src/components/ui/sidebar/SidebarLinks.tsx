import { ComponentProps, ReactNode } from "react";
import { NavLink } from "react-router";

interface SidebarLinkProps extends Omit<ComponentProps<"a">, "href"> {
  to: string;
  children: ReactNode;
}

export const SidebarLink = ({ children, to, ...props }: SidebarLinkProps) => {
  return (
    <NavLink
      {...props}
      to={to}
      className={({ isActive }) => {
        return (
          "flex items-center gap-2 w-full h-full text-xl py-2 px-4 rounded-lg " +
          (isActive ? "bg-purple-600 font-extrabold" : "")
        );
      }}
    >
      {children}
    </NavLink>
  );
};
