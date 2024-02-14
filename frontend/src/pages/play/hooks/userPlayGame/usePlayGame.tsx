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
  const state = useRef({ ...initialState });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await getUserPlayGameData(id, setTitle, setGameCards, pairArray);
      state.current = {
        havePlayedFirstCard: false,
        havePlayedSecondCard: false,
      }

      setHasStartGame(true);
      handleStartTimer();

      setIsLoading(false);
    };
    loadData();
    return () => { };
  }, []);

  function makeBackImageVisible(gameCardIndex: number) {

    //Show back image
    const pairId = gameCards[gameCardIndex].pairID
    let cardIdentifier = pairId

    if ("word" in gameCards[gameCardIndex]) {
      cardIdentifier = cardIdentifier + "_back_image_word";
    } else {
      cardIdentifier = cardIdentifier + "_back_image_image";
    }
    console.log("makebackimageviisble", cardIdentifier)

    let div = document.getElementById(cardIdentifier) as HTMLDivElement;
    let newClassName = div.className;
    newClassName = newClassName.replace("opacity-0", "");
    newClassName = newClassName + "hover:cursor-pointer"
    div.className = newClassName
  }

  function makeBackImageOpacityToZero(pairIdIdentifier: string, gameCardIndex: number) {
    //Hide backcard
    let idCoverToHide = pairIdIdentifier + "_back_image";
    if ("word" in gameCards[gameCardIndex]) {
      idCoverToHide = idCoverToHide + "_word";
    } else {
      idCoverToHide = idCoverToHide + "_image";
    }

    const div = document.getElementById(idCoverToHide) as HTMLDivElement;
    let newClassName = div.className;
    newClassName = newClassName.replace("hover:cursor-pointer", "");
    newClassName = newClassName + "opacity-0"
    div.className = newClassName

  }

  async function handleClickOnCard(gameCardIndex: number) {
    console.log(state.current)
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
    makeBackImageOpacityToZero(pairIdIdentifier, gameCardIndex)

    state.current.havePlayedFirstCard = true;
    state.current.firstCardIndex = gameCardIndex;
  }

  function hideCardsCompletely(pairID: string) {
    const divWordBackImageID = pairID + "_back_image_word"
    const divImageBackImageID = pairID + "_back_image_image"
    const divWordID = pairID + "_word_card"
    const divImageID = pairID + "_image_card"


    let div = document.getElementById(divWordBackImageID) as HTMLDivElement
    let oldClassNames = div.className
    oldClassNames = oldClassNames + " opacity-0"
    oldClassNames = oldClassNames.replaceAll("hover:cursor-pointer","")
    div.className = oldClassNames
    console.log(divWordBackImageID);
    

    div = document.getElementById(divImageBackImageID) as HTMLDivElement
    oldClassNames = div.className
    oldClassNames = oldClassNames + " opacity-0"
    oldClassNames = oldClassNames.replaceAll("hover:cursor-pointer","")
    div.className = oldClassNames
    console.log(divImageBackImageID);

    div = document.getElementById(divWordID) as HTMLDivElement
    oldClassNames = div.className
    oldClassNames = oldClassNames + " opacity-0"
    div.className = oldClassNames
    console.log(divWordID);


    //Hide image card
    div = document.getElementById(divImageID) as HTMLDivElement
    oldClassNames = div.className
    oldClassNames = oldClassNames + " opacity-0"
    div.className = oldClassNames
    console.log(divImageID);

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
    hideCardsCompletely(pairIdIdentifier)

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

    // Show cover image
    makeBackImageVisible(firstCardIndex)
    makeBackImageVisible(secondCardIndex)



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
    makeBackImageOpacityToZero(pairIdIdentifier, gameCardIndex)


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

    console.log("asdf")
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
