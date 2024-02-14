import { Link, useParams } from "react-router-dom";
import { usePlayGame } from "./hooks/userPlayGame/usePlayGame";
import { LogoSplash } from "@/Components/LogoSplash";
import Timer from "./smallComponents/Timer";
import GameCardUI from "./smallComponents/GameCard";
import { Button, Spinner } from "@nextui-org/react";
import bgMusic from "../../assets/music/bg.mp3";
import celebrationMusic from "@/assets/music/celebration.mp3";
import trophyImage from "@/assets/images/trophy.png";
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const PlayGame = () => {
  const params = useParams();
  const id = Number(params.id);
  const logic = usePlayGame(id);
  const bgMusicAudioRef = useRef<HTMLAudioElement>(null);
  const celebrationMusicAudioRef = useRef<HTMLAudioElement>(null);
  const [muteSound, setMutSound] = useState(false);

  function handleMusicButton() {
    setMutSound(!muteSound);
  }

  useEffect(() => {
    if (muteSound) {
      celebrationMusicAudioRef.current?.pause();
      bgMusicAudioRef.current?.pause();
      return;
    }

    if (!logic.hasWonGame) {
      celebrationMusicAudioRef.current?.pause();
      bgMusicAudioRef.current?.play();
      return;
    }
    bgMusicAudioRef.current?.pause();
    celebrationMusicAudioRef.current?.play();
  }, [logic.hasWonGame, muteSound]);

  return (
    <div className="bg-secondary flex min-h-screen flex-col p-2">
      <audio
        ref={bgMusicAudioRef}
        loop={true}
        autoPlay={true}
        hidden={true}
        src={bgMusic}
      />
      <div className="flex justify-between">
        <Link to={"../"} className="w-20">
          <LogoSplash variant="grey" />
        </Link>
        <div className="mr-20 flex gap-2">
          <Timer seconds={logic.seconds} />
          <button
            className="h-10 w-10 rounded-full  bg-gray-600 p-2 text-white hover:bg-gray-600/60"
            onClick={() => handleMusicButton()}
          >
            {muteSound ? <VolumeX /> : <Volume2 />}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="self-center text-center text-3xl font-bold">
          {logic.title}
        </h1>
      </div>

      {logic.hasWonGame && (
        <div className="flex flex-1  flex-col items-center justify-center self-center">
          <audio
            ref={celebrationMusicAudioRef}
            hidden={true}
            loop={false}
            src={celebrationMusic}
          />
          <h1 className="text-4xl font-bold">You won!! </h1>
          <img width={"240px"} src={trophyImage} />

          <Button
            onClick={() => logic.handleRestartGame()}
            className="mt-2 w-44 bg-cyan-800 text-white transition-all hover:bg-cyan-500"
          >
            Play again
          </Button>
          <Link to={"../"}>
            <Button className="mt-1 w-44 bg-cyan-800 text-white transition-all hover:bg-cyan-500">
              Back to games
            </Button>
          </Link>
        </div>
      )}

      {logic.isLoading && (
        <div className="mt-32 flex flex-col  self-center">
          <Spinner />
          <br />
          <h1 className="font-semibold">Loading</h1>
        </div>
      )}
      {!logic.isLoading && (
        <>
          {logic.hasStartGame && !logic.hasWonGame && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              {logic.gameCards.map((card, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      logic.handleClickOnCard(i);
                    }}
                  >
                    <GameCardUI card={card} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
