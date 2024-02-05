import { Link, useParams } from "react-router-dom";
import { usePlayGame } from "./hooks/userPlayGame.tsx/usePlayGame";
import { LogoSplash } from "@/Components/LogoSplash";
import Timer from "./smallComponents/Timer";
import GameCardUI from "./smallComponents/GameCard";
import { Button } from "@nextui-org/react";

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


			<div className="flex flex-col items-center">
				<h1 className="text-center self-center text-3xl font-bold">{logic.title}</h1>
			</div>

			{logic.hasWonGame &&
				<div className="flex flex-col  self-center items-center justify-center flex-1">
					<h1 className="font-bold text-4xl">You won!! </h1>
					<Button onClick={() => logic.handleRestartGame()} className="w-44 bg-cyan-800 hover:bg-cyan-500 text-white transition-all" >Play again</Button>
					<Link to={"../"}>
						<Button className="w-44 mt-1 bg-cyan-800 hover:bg-cyan-500 text-white transition-all">Back to games</Button>
					</Link>
				</div>
			}

			{
				logic.hasStartGame && !logic.hasWonGame &&
				<div className="flex flex-wrap gap-4 items-center justify-center mt-2">
					{
						logic.gameCards.map(
							(card, i) => {
								return (<div key={i} onClick={() => { logic.handleClickOnCard(i) }}>
									<GameCardUI card={card} />
								</div>
								)
							}
						)
					}
				</div>

			}


		</div >

	)
}
