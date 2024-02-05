import { Children, FC, ReactNode } from "react";

interface Props extends React.ButtonHTMLAttributes<Text> {
  children: ReactNode;
  onClick?: () => void;
}

export const Button: FC<Props> = ({ children, onClick, className }: Props) => {
  return (
    <button
      onClick={onClick}
      className={" min-w-[15rem] rounded bg-cyan-800 py-1  text-center text-white transition-all hover:cursor-pointer hover:bg-cyan-500 " + " " + className}
    >
      {children}
    </button >
  );
};
