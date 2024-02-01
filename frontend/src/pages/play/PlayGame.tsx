import { Link, useParams } from "react-router-dom";
import { usePlayGame } from "./hooks/userPlayGame.tsx/usePlayGame";
import { LogoSplash } from "@/Components/LogoSplash";
import { GameLayout } from "@/layouts/GameLayout";
import Timer from "./smallComponents/Timer";
import { Button } from "@nextui-org/react";
import { Image } from "@/models";

interface GameCard {
	pairID: number
}
interface ImageGameCard extends GameCard {
	image: Image
}
interface WordGameCard extends GameCard {
	word: string
}

function ImageGameCard(props: ImageGameCard) {
	return (
		<><h1>{"Im an image game card"}</h1></>
	)
}

function WordGameCard(props: WordGameCard) {

	return (
		<><h1>{"Im a word game card"}</h1></>
	)
}

export const PlayGame = () => {
	const params = useParams();
	const id = Number(params.id);
	const logic = usePlayGame(id)


	return (
		<div className="flex min-h-screen flex-col p-2 bg-secondary">
			<div className="flex justify-between">
				<Link to={"../"} className="w-20">
					<LogoSplash variant="grey" />
				</Link>
				<div className="mr-20">
					<Timer seconds={logic.seconds} />
				</div>
			</div>


			<div className=" items-center">
				<h1 className="text-center self-center text-3xl font-bold">{logic.title}</h1>
				<div className="">
				</div>
				<Button size="sm" onClick={() => logic.handleStartTimer()}>Play</Button>
				<Button size="sm" onClick={() => logic.handleRestartTimer()}>Start Over</Button>
			</div>

		</div>

	)
}