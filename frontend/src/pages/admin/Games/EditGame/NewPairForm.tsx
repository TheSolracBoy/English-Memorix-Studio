import { Button, Input } from "@nextui-org/react";
import UploadImage from "./UploadIImag";
import { Image, TempPair } from "@/models/index";
import Pair from "./Pair";

interface NewPairFormProps {
  handleChangeWordPair: (newWord: string) => void;
  handleChangeImage: (image: Image | null) => void;
  handleCancelAddPair: () => void;
  handleSaveNewPair: () => void;
  pair: TempPair;
}

export default function NewPairForm({
  handleChangeWordPair,
  handleChangeImage,
  handleCancelAddPair,
  handleSaveNewPair,
  pair,
}: NewPairFormProps) {
  const { image } = pair.tempImageCard;
  const { word } = pair.wordCard;
  return (
    <>
      <div className=" flex items-center justify-center gap-4  p-2">
        <Input
          type="text"
          value={word}
          onChange={(e) => handleChangeWordPair(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-2/12"
          placeholder="Enter word"
        ></Input>
        <Pair word={word} image={image} />

        <div className="w-60">
          <UploadImage image={image} handleSetImage={handleChangeImage} />
        </div>

        <div className=" flex flex-col gap-2">
          <Button onClick={handleSaveNewPair}>Add pair</Button>
          <Button onClick={handleCancelAddPair}>Cancel</Button>
        </div>
      </div>
    </>
  );
}
