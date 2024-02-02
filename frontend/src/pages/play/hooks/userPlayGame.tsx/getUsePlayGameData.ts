import { ImageGameCardPlay, WordGameCardPlay, Image, GameCard } from "@/models"
import { GetPlayGameInfo } from "../../../../../wailsjs/go/app/App"
import { app } from "../../../../../wailsjs/go/models"
import { shuffleArray } from "@/utils"

interface PairOfGameCards {
	imageCard: ImageGameCardPlay
	wordCard: WordGameCardPlay
}

function generateImageFromBase64(imageFormat: string, base64Image: string): Image {
	return {
		type: imageFormat,
		src: `data:${imageFormat};base64,${base64Image}`
	}
}


function transformPairToGameCards(pair: app.PairWithBase64Image): PairOfGameCards {

	const wordCard: WordGameCardPlay = {
		pairID: pair.id,
		word: pair.word
	}

	const imageCard: ImageGameCardPlay = {
		pairID: pair.id,
		image: generateImageFromBase64(pair.image_format, pair.base64_image)
	}

	return {
		wordCard: wordCard,
		imageCard: imageCard
	}

}

export const getUserPlayGameData = async (
	id: number,
	setTitle: (a: string) => void,
	setGameCards: (a: GameCard[]) => void
) => {
	try {
		const response = await GetPlayGameInfo(id)
		console.log(response)
		setTitle(response.game_title)
		let gameCards: GameCard[] = []

		response.pairs.forEach(
			(pair) => {
				const gameCardPair = transformPairToGameCards(pair)
				gameCards.push(gameCardPair.imageCard)
				gameCards.push(gameCardPair.wordCard)
			}
		)

		gameCards = shuffleArray(gameCards)
		console.log("inside getUse", gameCards)
		setGameCards(gameCards)

	}
	catch (error) {
		console.log(error);
	}
}