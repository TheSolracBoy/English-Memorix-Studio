import { Children, FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => {};
}

export const Button: FC<Props> = ({ children = null, onClick = ()=>{} }) => {
  return (
    <button
      onClick={onClick}
      className=" min-w-[15rem] rounded bg-cyan-800 py-1  text-center text-white transition-all hover:cursor-pointer hover:bg-cyan-500"
    >
      {children}
    </button>
  );
};
