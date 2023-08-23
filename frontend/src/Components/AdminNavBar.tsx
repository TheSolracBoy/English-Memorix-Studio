import { Link } from "react-router-dom";

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
    <div className="sticky top-0 z-10 flex h-14 items-center  bg-secondary">
      <div className="ml-4 w-16 ">
        <Link to="/selectMode">
          <svg
            width="100%"
            height="100%"
            viewBox=""
            className="translate-y-7 scale-[65%]"
          >
            <g transform="" fill="#000000">
              <title>video-game-controller-joystick-buttons</title>
              <path d="M25,43H21V39a1,1,0,0,0-1-1H16a1,1,0,0,0-1,1v4H11a1,1,0,0,0-1,1v4a1,1,0,0,0,1,1h4v4a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V49h4a1,1,0,0,0,1-1V44A1,1,0,0,0,25,43Zm-1,4H20a1,1,0,0,0-1,1v4H17V48a1,1,0,0,0-1-1H12V45h4a1,1,0,0,0,1-1V40h2v4a1,1,0,0,0,1,1h4Z" />
              <path d="M47.764,30.1A16.618,16.618,0,0,0,46,30H35V26H33V24a4,4,0,0,0-4-4H24a2,2,0,0,1,0-4H40a4,4,0,0,0,0-8H35a2,2,0,0,1-2-2V2H31V6a4,4,0,0,0,4,4h5a2,2,0,0,1,0,4H24a4,4,0,0,0,0,8h5a2,2,0,0,1,2,2v2H29v4H18a16.314,16.314,0,0,0-1.766.1c-6.9.74-13.368,7.187-14.133,14.078A16,16,0,0,0,26.421,59.6a9.794,9.794,0,0,1,4.389-1.551,15.424,15.424,0,0,1,2.325-.008,9.868,9.868,0,0,1,4.458,1.568A16,16,0,0,0,61.9,44.173C61.133,37.282,54.661,30.835,47.764,30.1ZM31,28h2v2H31ZM56.435,55.334a13.991,13.991,0,0,1-17.788,2.575,11.8,11.8,0,0,0-5.369-1.863Q32.645,56,32,56c-.455,0-.9.019-1.348.054A11.763,11.763,0,0,0,25.364,57.9,14,14,0,0,1,4.089,44.4c.658-5.922,6.432-11.674,12.36-12.311A14.379,14.379,0,0,1,18,32H46a14.724,14.724,0,0,1,1.551.083c5.927.637,11.7,6.389,12.36,12.311A13.9,13.9,0,0,1,56.435,55.334Z" />
              <path d="M46,44a4,4,0,1,0-4-4A4,4,0,0,0,46,44Zm0-6a2,2,0,1,1-2,2A2,2,0,0,1,46,38Z" />
              <path d="M46,48a4,4,0,1,0,4,4A4,4,0,0,0,46,48Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,46,54Z" />
              <path d="M39,42a4,4,0,1,0,4,4A4,4,0,0,0,39,42Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,39,48Z" />
              <path d="M53,42a4,4,0,1,0,4,4A4,4,0,0,0,53,42Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,53,48Z" />
            </g>
          </svg>
        </Link>
      </div>
      <div className=" ml-4 flex gap-4">
        <NavLink to="/admin/games">Games</NavLink>
        <NavLink to="/admin/categories">Categories</NavLink>
      </div>
    </div>
  );
};
