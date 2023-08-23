import { FC, InputHTMLAttributes } from "react";
import { combineClassNames } from "../utils/combineClassNames";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input: FC<InputProps> = (props) => {
  const style = "rounded bg-gray-200 px-2 py-1"
  let className;

  if (props.className) {
   className = combineClassNames(style, props.className);
  }
  else{
     className = style;
  }

  return <input {...props} className={className}  />;
};
