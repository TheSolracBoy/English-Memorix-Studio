import { Image } from "@/models";

interface Props {
  word: string;
  image: Image | null;
}
export default function Pair(props: Props) {
  return (
    <div className="flex gap-2">
      <div className="flex  flex-col items-center justify-center">
        <span>Word Card</span>

        <div className="flex h-52 w-32 items-center justify-center rounded-md border p-2">
          <p className="break-all ">{props.word}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <span>Image Card</span>
        <div className="flex h-52 w-32 items-center justify-center rounded-md border p-2">
          {props.image?.src && <img className="" src={props.image?.src} />}
        </div>
      </div>
    </div>
  );
}
