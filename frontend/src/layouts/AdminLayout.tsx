import { FC, useState } from "react";
import { AdminNavBar } from "../Components/AdminNavBar";
import { CreateNewCategory } from "../../wailsjs/go/app/App";

type Props = {
  children: React.ReactNode;
  title: string;
};

export const AdminLayout: FC<Props> = (props) => {
  return (
    <div className="flex min-h-screen flex-col overscroll-none">
      <AdminNavBar />

      <div className=" flex flex-1  flex-col bg-gray-100 px-2 py-4 md:px-8">
        <div className="flex flex-1 flex-col  rounded-lg  bg-white px-2 py-2 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold">{props.title}</h1>
          {props.children}
        </div>
      </div>
    </div>
  );
};
