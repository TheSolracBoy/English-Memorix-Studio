import { useEffect, useState } from "react";
import { SelectProps } from "antd";

import {
  GetCategoriesFromGame,
  GetGameInfo,
  LoadAllCategories,
  EditGame,
  AskUserForConfirmation,
  Alert,
  CopyGame,
  RemoveFromTemporary,
  AddPairToTemporary,
  EditFromTemporary,
} from "../../../../../wailsjs/go/app/App";

import { useNavigate } from "react-router-dom";
import { Image, Pair, TempPair } from "@/models";
import { app } from "../../../../../wailsjs/go/models";
import { getBinaryFromUrl } from "@/utils";

const emptyTempPair: TempPair = {
  tempImageCard: {
    image: null,
  },
  wordCard: {
    word: "",
  },
};

interface Props {
  gameID: number;
}
export const useEditGame = (props: Props) => {
  const { gameID } = props;
  const navigator = useNavigate();

  const [categories, setCategories] = useState<SelectProps["options"]>();
  const [gameTitle, setGameTitle] = useState("");
  const [newGameDescription, setNewGameDescription] = useState("");
  const [selectedCategoriesIDs, setSelectedCategoriesIDs] = useState<number[]>(
    [],
  );
  const [blob, setBlob] = useState<Blob>(new Blob());

  const [tempPair, setTempPair] = useState<TempPair>(emptyTempPair);
  const [pairs, setPairs] = useState<Pair[]>([]);

  const [editingSavedPairID, setEditingSavedPairID] = useState<number | null>(null)
  const [isLoadingSaveEdit, setIsLoadingSaveEdit] = useState(false)
  const [isLoadingPairs, setIsLoadingPairs] = useState(false)



  const [showAddNewPair, setShowAddNewPair] = useState(false);
  function handlerAddNewPair() {
    if (showAddNewPair === false) {
      setShowAddNewPair(true);
    }
  }

  async function handleSaveEditingOldPair(newPair: Pair) {
    if (editingSavedPairID === null) {
      return
    }

    setPairs(
      pairs.map(
        (pair, index) => {
          if (index == editingSavedPairID) {
            return newPair
          }
          return pair
        }
      )
    )

    await EditFromTemporary(newPair.id, {
      word: newPair.wordCard.word,
      game_id: gameID,
      base64_image: newPair.tempImageCard.image?.src.split(",")[1] as string,
      image_format: newPair.tempImageCard.image?.type as string,
    })

    setEditingSavedPairID(null)
  }

  function handleCancelEditingSavedPair() {
    setEditingSavedPairID(null)
  }

  async function handleEditSavedPair(index: number) {
    if (editingSavedPairID == null) {
      setEditingSavedPairID(index)
      return
    }
    await Alert("Can't edit two pairs", "You have another pair being edited, pls finish editing that pair before continue")
  }

  function handleChangeWordTempPair(newWord: string) {
    setTempPair({
      ...tempPair,
      wordCard: {
        word: newWord,
      },
    });
  }

  function handleChangeImage(image: Image | null) {
    setTempPair({
      ...tempPair,
      tempImageCard: {
        image: image,
      },
    });
  }

  // async function handleRemovePair(index: number) {
  //   if (
  //     pairs[index] !== null &&
  //     pairs[index].tempImageCard.image !== null &&
  //     pairs[index].tempImageCard.image?.src !== null
  //   ) {
  //     URL.revokeObjectURL(pairs[index].tempImageCard.image?.src as string);
  //     setPairs(pairs.filter((_, i) => i !== index));
  //     await RemoveFromTemporary(index)
  //   }
  // }

  async function handleSavePair() {
    let message = "";
    if (tempPair.wordCard.word === "") {
      message = "Word can not be empty\n";
    }
    if (
      tempPair.tempImageCard.image === null ||
      tempPair.tempImageCard.image?.src === null
    ) {
      message += "Image can not be empty\n";
    }
    if (message !== "") {
      alert(message);
      return;
    }

    // const response = await fetch(tempPair.tempImageCard.image?.src as string);
    // const blob = await response.blob();
    // const blobUrl = URL.createObjectURL(blob);

    const id = await AddPairToTemporary({
      word: tempPair.wordCard.word,
      game_id: gameID,
      base64_image: (tempPair.tempImageCard.image?.src as string).split(',')[1],
      image_format: tempPair.tempImageCard.image?.type as string
    })

    const newPair: Pair = {
      id: id,
      tempImageCard: {
        image: {
          src: tempPair.tempImageCard.image?.src as string,
          type: tempPair.tempImageCard.image?.type,
        },
      },
      wordCard: {
        word: tempPair.wordCard.word,
      },
    };

    setPairs([...pairs, newPair]);
    setTempPair(emptyTempPair);
    setShowAddNewPair(false);



    alert("Pair saved");
  }

  useEffect(() => {
    const a = async () => {
      await CopyGame(gameID)
      await getCategories();
      await getGameInformation();
      await getCategoriesFromGame();
    }
    a()
  }, []);

  useEffect(() => {
    // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
    return () => {
      if (tempPair.tempImageCard.image && tempPair.tempImageCard.image.src) {
        URL.revokeObjectURL(tempPair.tempImageCard.image.src);
      }
    };
  }, [tempPair.tempImageCard.image]);

  async function getCategoriesFromGame() {
    try {
      const getCategories = await GetCategoriesFromGame(gameID);
      const temp: number[] = [];
      for (let i = 0; i < getCategories.length; i++) {
        const cat = getCategories[i];
        temp.push(cat.id);
      }

      setSelectedCategoriesIDs(() => [...temp]);
    } catch (error) {
      console.log(error);
    }
  }

  async function getGameInformation() {
    try {
      setIsLoadingPairs(true)
      const gameInfo = await GetGameInfo(gameID);

      setGameTitle(gameInfo.title);
      setNewGameDescription(gameInfo.description);
      let newPairs: Pair[] = [];


      gameInfo.pairs.forEach((pair) => {

        newPairs.push({
          id: pair.id,
          wordCard: {
            word: pair.word,
          },
          tempImageCard: {
            image: {
              src: "data:" + pair.imageFormat + ";base64," + pair.base64Image,
              type: pair.imageFormat,
            },
          },
        });
      });

      setPairs(newPairs);
      console.log(newPairs)
      setIsLoadingPairs(false)
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditGame() {
    if (showAddNewPair === true) {
      const userWantsToDitchNewPair = await AskUserForConfirmation("Ditch pair", "You are creating a new pair, do you want ditch the new pair and save the changes?")
      if (userWantsToDitchNewPair === false) {
        return;
      }
    }

    const editGame = await AskUserForConfirmation("Confirm", "Are you sure you want to edit this game?")
    if (editGame === false) {
      return;
    }
    setIsLoadingSaveEdit(true)

    // let inputPairs: app.InputPair[] = [];
    // for (const pair of pairs) {
    //   let binaryImage;
    //   try {
    //     binaryImage = await getBinaryFromUrl(
    //       pair.tempImageCard.image?.src as string,
    //     );
    //   } catch (error) {
    //     alert(error);
    //     return;
    //   }

    //   inputPairs.push({
    //     bytes: binaryImage,
    //     imageFormat: pair.tempImageCard.image?.type as string,
    //     word: pair.wordCard.word,
    //   });
    // }
    console.log("End")

    try {
      await EditGame(
        gameID,
        gameTitle,
        newGameDescription,
        selectedCategoriesIDs,
      );
    } catch (error) {
      setIsLoadingSaveEdit(false)
      alert("Error editing game: " + error);
      return;
    }
    setIsLoadingSaveEdit(false)
    alert("Game edited successfully");
    navigator("../");
  }

  async function handleCancelButton() {
    const userConfirmCancelEdit = await AskUserForConfirmation("Cancel", "Are you sure you want to cancel?")
    if (!userConfirmCancelEdit) {
      return;
    }
    navigator("../");
  }

  async function handleCancelAddNewPair() {
    if (
      tempPair.tempImageCard.image !== null ||
      tempPair.wordCard.word !== ""
    ) {
      const userWantsToCancel = await AskUserForConfirmation("Cancel", "Creating new pair in progress, do you want to cancel?")

      if (!userWantsToCancel) {
        return;
      }

      setTempPair(emptyTempPair);
    }

    setShowAddNewPair(false);
  }


  async function getCategories() {
    try {
      const categoriesFromBE = await LoadAllCategories();
      const temp: SelectProps["options"] = [];

      for (let i = 0; i < categoriesFromBE.length; i++) {
        const hello = categoriesFromBE[i];
        temp.push({
          label: hello.title,
          value: hello.id,
        });
      }
      setCategories(() => [...temp]);
    } catch (error) {
      console.log(error);
    }
  }

  async function eliminateFromSavedCards(index: number) {
    if (editingSavedPairID !== null) {
      await Alert("Can't delete pair", "You have another pair being edited, pls finish editing that pair before continue")
      return
    }
    let pairIdentifier = pairs[index].id
    setPairs(
      pairs.filter((pair, i) => {
        if (i !== index) {
          return pair
        }
      })
    )
    console.log(pairIdentifier);

    await RemoveFromTemporary(pairIdentifier)
  }

  const [files, setFiles] = useState<any>([]);

  return {
    eliminateFromSavedCards,
    categories,
    setCategories,
    gameTitle,
    setGameTitle,
    newGameDescription,
    setNewGameDescription,
    selectedCategoriesIDs,
    setSelectedCategoriesIDs,
    files,
    setFiles,
    handleEditGame,
    handleCancelButton,
    handlerAddNewPair,
    showAddNewPair,
    handleCancelAddNewPair,
    blob,
    setBlob,
    handleSavePair,
    tempPair,
    handleChangeWordTempPair,
    handleChangeImage,
    pairs,
    handleEditSavedPair,
    editingSavedPairID,
    handleCancelEditingSavedPair,
    handleSaveEditingOldPair,
    isLoadingSaveEdit,
    isLoadingPairs
  };
};
