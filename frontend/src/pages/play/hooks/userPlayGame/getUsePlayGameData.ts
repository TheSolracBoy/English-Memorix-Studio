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
		identifier: pair.id + "_word",
		haveBeenGuessed: false,
		isHidden: true,
		pairID: pair.id,
		word: pair.word

	}
	const imageCard: ImageGameCardPlay = {
		identifier: pair.id + "_image",
		haveBeenGuessed: false,
		isHidden: true, pairID: pair.id,
		image: generateImageFromBase64(pair.image_format, pair.base64_image)
	}

	return {
		wordCard: wordCard,
		imageCard: imageCard
	}

}

export async function getUserPlayGameData(
	id: number,
	setTitle: (a: string) => void,
	pairIDSRef: React.MutableRefObject<string[]>
): Promise<GameCard[]> {
	try {
		const game = await GetPlayGameInfo(id);
		setTitle(game.game_title);
		const gameCards: GameCard[] = [];

		game.pairs.forEach((pair) => {
			pairIDSRef.current.push(pair.id);
			const gameCardPair = transformPairToGameCards(pair);
			gameCards.push(gameCardPair.imageCard);
			gameCards.push(gameCardPair.wordCard);
		});

		const shuffledGameCards = shuffleArray(gameCards);
		console.log(shuffledGameCards);
		return shuffledGameCards;
	} catch (error) {
		// Handle error if GetPlayGameInfo() fails
		console.error('Error:', error);
		return [];
	}
}

