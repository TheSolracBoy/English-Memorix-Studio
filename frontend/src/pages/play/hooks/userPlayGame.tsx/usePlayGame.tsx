import { useEffect, useRef, useState } from "react"
import useTimer from "../useTimer"
import { getUserPlayGameData } from "./getUsePlayGameData"
import { GameCard } from "@/models"
import { sleep } from "@/utils"
// TODO: Extract the game logic to ./gameLogic.ts file


interface GameState {
	havePlayedFirstCard: boolean
	havePlayedSecondCard: boolean
	firstCardIndex?: number,
}

let state: GameState = {
	havePlayedFirstCard: false,
	havePlayedSecondCard: false,
}


export const usePlayGame = (id: number) => {
	const [gameCards, setGameCards] = useState<GameCard[]>([])
	const [title, setTitle] = useState("")
	const [hasWonGame, setHasWonGame] = useState(false)
	const { seconds, handleStartTimer, handleStopTimer, handleRestartTimer } = useTimer()
	const pairArray = useRef<string[]>([])

	useEffect(() => {
		const loadData = async () => {
			await getUserPlayGameData(id, setTitle, setGameCards, pairArray)
		}
		loadData()
		console.log(pairArray)
		return () => {
		}
	}, [])

	async function handleClickOnCard(gameCardIndex: number) {
		const cardRef = gameCards[gameCardIndex]
		if (!cardRef) { // null case
			return
		}
		if (cardRef.haveBeenGuessed) {
			return
		}
		if (!cardRef.isHidden) {
			return
		}

		if (state.havePlayedSecondCard) {
			return
		}

		if (!state.havePlayedFirstCard) {
			manageFirstPlay(gameCardIndex)
			return
		}

		await manageSecondCardPlay(gameCardIndex)
	}

	function manageFirstPlay(gameCardIndex: number) {

		//Show first card and update gameState object
		setGameCards(
			gameCards.map((gameCard, i) => {
				if (gameCardIndex === i) {
					gameCard.isHidden = false
				}
				return gameCard
			})
		)
		state.havePlayedFirstCard = true
		state.firstCardIndex = gameCardIndex
	}


	function manageFoundPair(firstCardIndex: number, secondCardIndex: number) {

		// Hide cards and set flag haveBeenGuessed to true
		setGameCards(
			gameCards.map((gameCard, i) => {
				if (firstCardIndex === i || secondCardIndex === i) {
					gameCard.isHidden = true
					gameCard.haveBeenGuessed = true
				}
				return gameCard
			})
		)

		//Update gameStateObject 
		state.havePlayedFirstCard = false
		state.havePlayedSecondCard = false
		state.firstCardIndex = 0

		//Verify that game hasnt finished
		// An "PairID" array was used to speed the verification
		// TODO:

		const cardRedf = gameCards[firstCardIndex]

		console.log(pairArray)

		pairArray.current = pairArray.current.filter(
			(id) => {
				return id !== cardRedf.pairID
			}
		)
		console.log(pairArray)
		if (pairArray.current.length === 0) {
			setHasWonGame(true)
		}


	}

	function manageNotFoundPair(firstCardIndex: number, secondCardIndex: number) {
		console.log("manage not found pair")
		setGameCards(
			gameCards.map((gameCard, i) => {
				if (firstCardIndex === i || secondCardIndex === i) {
					gameCard.isHidden = true
				}
				return gameCard
			})
		)

		state.havePlayedFirstCard = false
		state.havePlayedSecondCard = false
		state.firstCardIndex = 0

	}

	async function manageSecondCardPlay(gameCardIndex: number) {

		//Show the new card
		state.havePlayedSecondCard = true
		setGameCards(
			gameCards.map((gameCard, i) => {
				if (gameCardIndex === i) {
					gameCard.isHidden = false
				}
				return gameCard
			})
		)

		await sleep(1000) // Give the chanced to the user to memorize the card
		const actualCard = gameCards[gameCardIndex]
		const previousCard = gameCards[state.firstCardIndex as number]

		if (actualCard.pairID == previousCard.pairID) {
			manageFoundPair(state.firstCardIndex as number, gameCardIndex)
			return
		}


		manageNotFoundPair(state.firstCardIndex as number, gameCardIndex)
	}



	return { title, seconds, handleStartTimer, handleStopTimer, handleRestartTimer, gameCards, handleClickOnCard, hasWonGame }
}