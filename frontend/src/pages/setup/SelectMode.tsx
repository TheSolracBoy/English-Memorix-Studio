import { Link } from "react-router-dom";

export const SelectMode = () => {
  return (
    <div className="flex min-h-screen">
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 mx-auto my-auto flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white  bg-opacity-90 text-xl font-medium shadow-2xl">
        <p className="">Select</p>
        <p className="">Mode</p>
      </div>

      <Link to="/admin/games" className="flex flex-1 flex-col items-center justify-center bg-secondary text-center text-4xl font-bold transition-all hover:cursor-pointer hover:bg-sky-400 hover:text-6xl">
        Admin Mode
      </Link>
      <a  className=" flex flex-1 flex-col items-center justify-center bg-sky-600 text-center text-4xl font-bold transition-all hover:cursor-pointer hover:bg-sky-400 hover:text-6xl">
        Play Mode
      </a>
    </div>
  );
};
