import { Button, Input } from "@nextui-org/react";
import UploadImage from "./UploadIImag";
import { Image, TempPair, Pair as PairType } from "@/models/index";
import Pair from "./Pair";
import { useState } from "react";

interface Props {
	handleCancelAddPair: () => void;
	handleSaveNewPair: (pair: PairType) => Promise<void>;
	pair: PairType;
}

export default function OldPairEditForm({
	handleCancelAddPair,
	handleSaveNewPair,
	pair,
}: Props) {
	console.log(pair)
	const [image, setImage] = useState(pair.tempImageCard.image)
	const [word, setWord] = useState(pair.wordCard.word)
	return (
		<>
			<div className=" flex items-center justify-center gap-4  p-2">
				<Input
					type="text"
					value={word}
					onChange={(e) => setWord(e.target.value)}
					onSubmit={(e) => {
						e.preventDefault();
					}}
					className="w-2/12"
					placeholder="Enter word"
				></Input>
				<Pair word={word} image={image} />

				<div className="w-60">
					<UploadImage image={image} handleSetImage={setImage} />
				</div>

				<div className=" flex flex-col gap-2">
					<Button onClick={async () => await handleSaveNewPair({
						id: pair.id,
						tempImageCard: {
							image: image
						},
						wordCard: {
							word: word
						}
					})}>Save changes</Button>
					<Button onClick={handleCancelAddPair}>Cancel</Button>
				</div>
			</div>
		</>
	);
}
