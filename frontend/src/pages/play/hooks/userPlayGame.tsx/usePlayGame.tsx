import { useEffect, useState } from "react"
import { app, database } from "../../../../../wailsjs/go/models"
import { GetPlayGameInfo } from "../../../../../wailsjs/go/app/App"
import useTimer from "../useTimer"
import { getUserPlayGameData } from "./getUsePlayGameData"


export const usePlayGame = (id: number) => {
	const [pairs, setPairs] = useState<database.Pair[]>([])
	const [title, setTitle] = useState("")
	const { seconds, handleStartTimer, handleStopTimer, handleRestartTimer } = useTimer()

	useEffect(() => {

		getUserPlayGameData(id, setTitle, setPairs)
		return () => {
		}
	}, [])



	return { pairs, title, seconds, handleStartTimer, handleStopTimer, handleRestartTimer }
}

