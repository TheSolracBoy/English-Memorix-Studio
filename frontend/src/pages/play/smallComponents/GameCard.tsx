import { GameCard, ImageGameCardPlay, WordGameCardPlay } from "@/models"
import imgUrl from '@/assets/images/backImage.png'

interface GameCardProps {
	card: GameCard
}
export default function GameCardUI({ card }: GameCardProps) {

	function isWordCard(): boolean {
		if ("word" in card) {
			return true
		}
		return false
	}
	return (
		<>

			{card.isHidden &&
				<div className={"h-52 w-32 rounded-md bg-cover  transition-all filter " +
					(card.haveBeenGuessed ? "opacity-0" : "hover:cursor-pointer")
				} style={
					{
						backgroundImage: `url(${imgUrl})`
					}
				}>
				</div>
			}

			{!card.isHidden &&
				(
					<div className=" h-52 w-32 flex justify-center items-center border rounded-md p-2 bg-white transition-all hover:cursor-pointer" >

						{!card.isHidden && (isWordCard() ?
							((card) as WordGameCardPlay).word
							:
							<img src={((card) as ImageGameCardPlay).image.src} alt="" />
						)
						}
					</div>
				)
			}


		</>
	)
}