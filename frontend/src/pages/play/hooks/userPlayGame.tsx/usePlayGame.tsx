import { useEffect, useState } from "react"
import useTimer from "../useTimer"
import { getUserPlayGameData } from "./getUsePlayGameData"
import { GameCard } from "@/models"

export const usePlayGame = (id: number) => {
	const [gameCards, setGameCards] = useState<GameCard[]>([])
	const [title, setTitle] = useState("")
	const { seconds, handleStartTimer, handleStopTimer, handleRestartTimer } = useTimer()

	useEffect(() => {
		const loadData = async () => {
			await getUserPlayGameData(id, setTitle, setGameCards)
			console.log("helo", gameCards)
		}
		loadData()
		return () => {
		}
	}, [])



	return { title, seconds, handleStartTimer, handleStopTimer, handleRestartTimer, gameCards }
}

