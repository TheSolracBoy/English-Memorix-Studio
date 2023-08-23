import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IsDev } from "../../../wailsjs/go/app/App";
import { LogoSplash } from "../../Components/LogoSplash";

export const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const devMode = async () => {
      const isDev = await IsDev();
      if (isDev) {
        navigate("/admin/games");
      }
    };
    devMode();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-secondary">
      <div className="w-96">
        <LogoSplash />
      </div>
      <Link
        className="mt-4 w-[24rem] rounded bg-cyan-800 py-1  text-center text-white transition-all hover:cursor-pointer hover:bg-cyan-500"
        to="/selectDatabase"
      >
        Start
      </Link>
    </div>
  );
};
