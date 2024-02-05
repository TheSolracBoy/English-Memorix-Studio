import { FC, useState } from "react";
import { AdminNavBar } from "../Components/AdminNavBar";
import { CreateNewCategory } from "../../wailsjs/go/app/App";

type Props = {
  children: React.ReactNode;
  title: string;
};

export const GameLayout: FC<Props> = (props) => {
  return (
    <div className=" flex min-h-screen flex-1  flex-col   ">
      <div className=" mx-2 flex flex-1 flex-col rounded-md bg-white px-2 py-2">
        {props.children}
      </div>
    </div>
  );
};
