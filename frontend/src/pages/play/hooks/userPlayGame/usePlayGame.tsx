import { useEffect, useRef, useState } from "react";
import useTimer from "../useTimer";
import { getUserPlayGameData } from "./getUsePlayGameData";
import { GameCard } from "@/models";
import { shuffleArray, sleep } from "@/utils";


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
      const cards = await getUserPlayGameData(id, setTitle, pairArray);
      setGameCards(cards)
      state.current = {
        havePlayedFirstCard: false,
        havePlayedSecondCard: false,
      }
      setIsLoading(false);
      setHasStartGame(true);
      handleStartTimer();



    };
    loadData();
    return () => { };
  }, []);


  useEffect(() => {

    const wait = async ()=>{
      await sleep(100)

    if (!hasWonGame) {
      for (let index = 0; index < gameCards.length; index++) {
        console.log(index)
        const card = gameCards[index];
        showCardContent(card.identifier)
      }
    }
    }
    
    wait()
  }, [hasWonGame, hasStartGame]);



  function makeBackImageVisible(domID: string) {

    //Show back image
    let div = document.getElementById(domID + "_back_image") as HTMLDivElement;
    let newClassName = div.className;
    newClassName = newClassName.replace("opacity-0", "");
    newClassName = newClassName + "hover:cursor-pointer"
    div.className = newClassName
  }

  function hideBackCardCover(domIDCard: string) {
    //Hide backcard
    const div = document.getElementById(domIDCard + "_back_image") as HTMLDivElement;
    let newClassName = div.className;
    newClassName = newClassName.replace("hover:cursor-pointer", "");
    newClassName = newClassName + "opacity-0"
    div.className = newClassName
  }

  async function handleClickOnCard(gameCardIndex: number) {
    const cardRef = gameCards[gameCardIndex];
    if (!cardRef) {
      // null case
      return;
    }
    if (cardRef.haveBeenGuessed) {
      return;
    }
    if (!cardRef.isHidden) {
      return;
    }

    if (state.current.havePlayedSecondCard) {
      return;
    }

    if (!state.current.havePlayedFirstCard) {
      manageFirstPlay(gameCardIndex);
      return;
    }

    await manageSecondCardPlay(gameCardIndex);
  }

  function showCardContent(domID: string) {
    const node = document.getElementById(domID) as HTMLDivElement
    // let newClassname = node.className
    // node.className = newClassname.replaceAll("opacity-0", "")
    console.log(node.id, node.style.opacity )
    node.style.opacity = "1"
    console.log(node.id, node.style.opacity )
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

    let cardIdentifier = gameCards[gameCardIndex].identifier;
    hideBackCardCover(cardIdentifier)

    state.current.havePlayedFirstCard = true;
    state.current.firstCardIndex = gameCardIndex;
  }

  function hideCardsCompletely(pairID: string) {
    const divWordBackImageID = pairID + "_word_back_image"
    const divImageBackImageID = pairID + "_image_back_image"

    const divWordID = pairID + "_word"
    const divImageID = pairID + "_image"


    //Hide word card cover image
    let div = document.getElementById(divWordBackImageID) as HTMLDivElement
    let oldClassNames = div.className
    oldClassNames = oldClassNames + " opacity-0"
    oldClassNames = oldClassNames.replaceAll("hover:cursor-pointer", "")
    div.className = oldClassNames


    //Hide image card cover image
    div = document.getElementById(divImageBackImageID) as HTMLDivElement
    oldClassNames = div.className
    oldClassNames = oldClassNames + " opacity-0"
    oldClassNames = oldClassNames.replaceAll("hover:cursor-pointer", "")
    div.className = oldClassNames

    //Hide word card
    div = document.getElementById(divWordID) as HTMLDivElement
    div.style.opacity = "0"


    //Hide image card
    div = document.getElementById(divImageID) as HTMLDivElement
    div.style.opacity = "0"
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
    const firstCardIdentifier = gameCards[firstCardIndex].identifier
    const secondCardIdentifier = gameCards[secondCardIndex].identifier
    makeBackImageVisible(firstCardIdentifier)
    makeBackImageVisible(secondCardIdentifier)

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

    const actualCard = gameCards[gameCardIndex];

    //Show the new card
    let cardIdentifier = actualCard.identifier
    hideBackCardCover(cardIdentifier)



    await sleep(1000); // Give the chanced to the user to memorize the card
    const previousCard = gameCards[state.current.firstCardIndex as number];

    if (actualCard.pairID == previousCard.pairID) {
      manageFoundPair(state.current.firstCardIndex as number, gameCardIndex);
      return;
    }

    manageNotFoundPair(state.current.firstCardIndex as number, gameCardIndex);
  }

  function handleRestartGame() {
    setHasStartGame(false);
    setIsLoading(true)

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
    setHasStartGame(true);

    setHasWonGame(false);
    setIsLoading(false)
    handleRestartTimer();
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
