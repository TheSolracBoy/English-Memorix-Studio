import { useEffect, useRef, useState } from "react";
import useTimer from "../useTimer";
import { getUserPlayGameData } from "./getUsePlayGameData";
import { GameCard } from "@/models";
import { shuffleArray, sleep } from "@/utils";

// TODO: Extract the game logic to ./gameLogic.ts file

interface GameState {
  havePlayedFirstCard: boolean;
  havePlayedSecondCard: boolean;
  firstCardIndex?: number;
}

const initialState: GameState = {
  havePlayedFirstCard: false,
  havePlayedSecondCard: false,
};

export const usePlayGame = (id: number) => {
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [title, setTitle] = useState("");
  const [hasWonGame, setHasWonGame] = useState(false);
  const [hasStartGame, setHasStartGame] = useState(false);
  const { seconds, handleStartTimer, handleStopTimer, handleRestartTimer } =
    useTimer();
  const pairArray = useRef<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const state = useRef(initialState);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await getUserPlayGameData(id, setTitle, setGameCards, pairArray);

      setHasStartGame(true);
      handleStartTimer();

      setIsLoading(false);
    };
    loadData();
    return () => {};
  }, []);

  async function handleClickOnCard(gameCardIndex: number) {
    console.log("1");
    const cardRef = gameCards[gameCardIndex];
    if (!cardRef) {
      // null case
      return;
    }
    if (cardRef.haveBeenGuessed) {
      console.log("2");
      return;
    }
    if (!cardRef.isHidden) {
      console.log("3");
      return;
    }

    if (state.current.havePlayedSecondCard) {
      console.log("4");
      return;
    }

    if (!state.current.havePlayedFirstCard) {
      console.log("5");
      manageFirstPlay(gameCardIndex);
      return;
    }

    console.log("6");
    await manageSecondCardPlay(gameCardIndex);
  }

  function manageFirstPlay(gameCardIndex: number) {
    setGameCards(
      gameCards.map((gameCard, i) => {
        if (gameCardIndex === i) {
          gameCard.isHidden = false;
        }
        return gameCard;
      }),
    );

    let pairIdIdentifier = gameCards[gameCardIndex].pairID;

    //show card word or image

    let idToShow = pairIdIdentifier;
    if ("word" in gameCards[gameCardIndex]) {
      idToShow = idToShow + "word";
    } else {
      idToShow = idToShow + "image";
    }
    const div = document.getElementById(idToShow) as HTMLDivElement;
    const oldClassName = div.className;
    div.className = oldClassName.replace("hidden", "flex");

    state.current.havePlayedFirstCard = true;
    state.current.firstCardIndex = gameCardIndex;
  }

  function manageFoundPair(firstCardIndex: number, secondCardIndex: number) {
    // Hide cards and set flag haveBeenGuessed to true
    setGameCards(
      gameCards.map((gameCard, i) => {
        if (firstCardIndex === i || secondCardIndex === i) {
          gameCard.isHidden = true;
          gameCard.haveBeenGuessed = true;
        }
        return gameCard;
      }),
    );

    let pairIdIdentifier = gameCards[firstCardIndex].pairID;
    let wordCardId = pairIdIdentifier + "word";
    let imageCardId = pairIdIdentifier + "image";

    const div = document.getElementById(wordCardId) as HTMLDivElement;
    div.className = div.className.replace("flex", "hidden");

    const imageDiv = document.getElementById(imageCardId) as HTMLDivElement;
    imageDiv.className = imageDiv.className.replace("flex", "hidden");

    //Update gameStateObject
    state.current.havePlayedFirstCard = false;
    state.current.havePlayedSecondCard = false;
    state.current.firstCardIndex = 0;

    const cardRedf = gameCards[firstCardIndex];

    pairArray.current = pairArray.current.filter((id) => {
      return id !== cardRedf.pairID;
    });
    if (pairArray.current.length === 0) {
      handleStopTimer();
      setHasWonGame(true);
    }
  }

  function manageNotFoundPair(firstCardIndex: number, secondCardIndex: number) {
    setGameCards(
      gameCards.map((gameCard, i) => {
        if (firstCardIndex === i || secondCardIndex === i) {
          gameCard.isHidden = true;
        }
        return gameCard;
      }),
    );

    //Hide all contents
    let pairIdIdentifier = gameCards[firstCardIndex].pairID;
    let wordCardId = pairIdIdentifier + "word";
    let imageCardId = pairIdIdentifier + "image";

    const div = document.getElementById(wordCardId) as HTMLDivElement;
    div.className = div.className.replace("flex", "hidden");
    const imageDiv = document.getElementById(imageCardId) as HTMLDivElement;
    imageDiv.className = imageDiv.className.replace("flex", "hidden");

    const secondCardID = gameCards[secondCardIndex].pairID;
    const div2 = document.getElementById(
      secondCardID + "word",
    ) as HTMLDivElement;

    div2.className = div2.className.replace("flex", "hidden");
    const imageDiv2 = document.getElementById(
      secondCardID + "image",
    ) as HTMLDivElement;
    imageDiv2.className = imageDiv2.className.replace("flex", "hidden");

    state.current.havePlayedFirstCard = false;
    state.current.havePlayedSecondCard = false;
    state.current.firstCardIndex = 0;
  }

  async function manageSecondCardPlay(gameCardIndex: number) {
    state.current.havePlayedSecondCard = true;
    setGameCards(
      gameCards.map((gameCard, i) => {
        if (gameCardIndex === i) {
          gameCard.isHidden = false;
        }
        return gameCard;
      }),
    );

    //Show the new card
    let pairIdIdentifier = gameCards[gameCardIndex].pairID;

    //Show word or image
    let idToShow = pairIdIdentifier;
    if ("word" in gameCards[gameCardIndex]) {
      idToShow = idToShow + "word";
    } else {
      idToShow = idToShow + "image";
    }
    const div = document.getElementById(idToShow) as HTMLDivElement;
    const oldClassName = div.className;
    div.className = oldClassName.replace("hidden", "flex");

    const actualCard = gameCards[gameCardIndex];

    await sleep(1000); // Give the chanced to the user to memorize the card
    const previousCard = gameCards[state.current.firstCardIndex as number];

    if (actualCard.pairID == previousCard.pairID) {
      manageFoundPair(state.current.firstCardIndex as number, gameCardIndex);
      return;
    }

    manageNotFoundPair(state.current.firstCardIndex as number, gameCardIndex);
  }

  function handleRestartGame() {
    setHasStartGame(true);
    handleRestartTimer();

    const newGameCards = gameCards.map((oldCard) => {
      oldCard.haveBeenGuessed = false;
      return oldCard;
    });

    const newGameCardsShuffle = shuffleArray(newGameCards);
    const idArray: string[] = [];

    newGameCardsShuffle.forEach((card) => {
      if (!idArray.includes(card.pairID)) {
        idArray.push(card.pairID);
      }
    });

    pairArray.current = idArray;
    setGameCards(newGameCardsShuffle);
    setHasWonGame(false);
  }

  return {
    title,
    seconds,
    hasStartGame,
    gameCards,
    handleClickOnCard,
    hasWonGame,
    handleRestartGame,
    isLoading,
  };
};
