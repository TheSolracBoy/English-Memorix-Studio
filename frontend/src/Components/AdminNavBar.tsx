import { Link } from "react-router-dom";
import { LogoSplash } from "./LogoSplash";

type NavLinkProps = {
  children: React.ReactNode;
  to: string;
};

const NavLink = ({ children, to }: NavLinkProps) => {
  const activeStyle =
    "bg-sky-700 px-2 py-1 rounded text-white hover:text-white ";
  const inactiveStyle = "px-2 py-1 text-gray-600   hover:bg-sky-200 rounded ";

  return (
    <Link
      className={
        window.location.href.includes(to) ? activeStyle : inactiveStyle
      }
      to={to}
    >
      {children}
    </Link>
  );
};

export const AdminNavBar = () => {
  return (
    <div className="sticky top-0 z-50 flex h-14 items-center  bg-secondary">
      <div className="ml-4 w-20 ">
        <Link to={"/selectMode"} className="w-20">
          <LogoSplash variant="blue"></LogoSplash>
        </Link>
      </div>
      <div className=" ml-4 flex gap-4">
        <NavLink to="/admin/games">Games</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
      </div>
    </div>
  );
};
