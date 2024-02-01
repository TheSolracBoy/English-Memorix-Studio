import { GetPlayGameInfo } from "../../../../../wailsjs/go/app/App"
import { database } from "../../../../../wailsjs/go/models"


export const getUserPlayGameData = async (id: number, setTitle: (a: string) => void, setPairs: (a: database.Pair[]) => void) => {
	try {
		const response = await GetPlayGameInfo(id)
		console.log(response)
		setTitle(response.game_title)
		setPairs(response.pairs)
	}
	catch (error) {
		console.log(error);
	}
}