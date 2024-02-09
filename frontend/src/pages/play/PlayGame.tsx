import { Link, useParams } from "react-router-dom";
import { usePlayGame } from "./hooks/userPlayGame.tsx/usePlayGame";
import { LogoSplash } from "@/Components/LogoSplash";
import Timer from "./smallComponents/Timer";
import GameCardUI from "./smallComponents/GameCard";
import { Button } from "@nextui-org/react";
import bgMusic from "../../assets/music/bg.mp3"
import celebrationMusic from "@/assets/music/celebration.mp3"
import trophyImage from "@/assets/images/trophy.png"
import { useEffect, useRef, useState } from "react";
import { Trophy, Volume, Volume2, VolumeX } from "lucide-react";

export const PlayGame = () => {
  const params = useParams();
  const id = Number(params.id);
  const logic = usePlayGame(id)
  const bgMusicAudioRef = useRef<HTMLAudioElement>(null)
  const celebrationMusicAudioRef = useRef<HTMLAudioElement>(null)
  const [muteSound, setMutSound] = useState(false)

  function handleMusicButton() {
    setMutSound(!muteSound)
  }

  useEffect(() => {
    if (muteSound) {
      celebrationMusicAudioRef.current?.pause()
      bgMusicAudioRef.current?.pause()
      return
    }

    if (!logic.hasWonGame) {
      celebrationMusicAudioRef.current?.pause()
      bgMusicAudioRef.current?.play()
      return
    }
    bgMusicAudioRef.current?.pause()
    celebrationMusicAudioRef.current?.play()

  }, [logic.hasWonGame, muteSound])

  return (
    <div className="flex min-h-screen flex-col p-2 bg-secondary">
      <audio ref={bgMusicAudioRef} loop={true} autoPlay={true} hidden={true} src={bgMusic} />
      <div className="flex justify-between">
        <Link to={"../"} className="w-20">
          <LogoSplash variant="grey" />
        </Link>
        <div className="mr-20 flex gap-2">
          <Timer seconds={logic.seconds} />
          <button className="p-2 w-10 h-10  rounded-full bg-gray-600 text-white hover:bg-gray-600/60" onClick={() => handleMusicButton()}>
            {muteSound ?
              <VolumeX />
              :
              <Volume2 />
            }


          </button>
        </div>
      </div>


      <div className="flex flex-col items-center">
        <h1 className="text-center self-center text-3xl font-bold">{logic.title}</h1>
      </div>

      {logic.hasWonGame &&
        <div className="flex flex-col  self-center items-center justify-center flex-1">
          <audio ref={celebrationMusicAudioRef} hidden={true} loop={false} src={celebrationMusic} />
          <h1 className="font-bold text-4xl">You won!! </h1>
          <img width={"240px"} src={trophyImage} />

          <Button onClick={() => logic.handleRestartGame()} className="mt-2 w-44 bg-cyan-800 hover:bg-cyan-500 text-white transition-all" >Play again</Button>
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
