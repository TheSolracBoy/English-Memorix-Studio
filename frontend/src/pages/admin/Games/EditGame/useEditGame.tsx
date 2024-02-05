import { useEffect, useState } from "react";
import { SelectProps } from "antd";

import {
  GetCategoriesFromGame,
  GetGameInfo,
  LoadAllCategories,
  EditGame,
  AskUserForConfirmation,
} from "../../../../../wailsjs/go/app/App";

import { useNavigate } from "react-router-dom";
import { Image, TempPair } from "@/models";
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
  const [pairs, setPairs] = useState<TempPair[]>([]);

  const [showAddNewPair, setShowAddNewPair] = useState(false);
  function handlerAddNewPair() {
    if (showAddNewPair === false) {
      setShowAddNewPair(true);
    }
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

  function handleRemovePair(index: number) {
    if (
      pairs[index] !== null &&
      pairs[index].tempImageCard.image !== null &&
      pairs[index].tempImageCard.image?.src !== null
    ) {
      URL.revokeObjectURL(pairs[index].tempImageCard.image?.src as string);
      setPairs(pairs.filter((_, i) => i !== index));
    }
  }

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

    const response = await fetch(tempPair.tempImageCard.image?.src as string);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const newPair: TempPair = {
      tempImageCard: {
        image: {
          src: blobUrl,
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
    getCategories();
    getGameInformation();
    getCategoriesFromGame();
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
      const gameInfo = await GetGameInfo(gameID);

      setGameTitle(gameInfo.title);
      setNewGameDescription(gameInfo.description);
      let newPairs: TempPair[] = [];

      gameInfo.pairs.forEach((pair) => {
        const base = pair.base64Image;
        var binaryImageData = atob(base);
        var byteArray = new Uint8Array(binaryImageData.length);

        for (var i = 0; i < binaryImageData.length; i++) {
          byteArray[i] = binaryImageData.charCodeAt(i);
        }
        var blob = new Blob([byteArray], { type: pair.imageFormat }); // Adjust the MIME type based on your image format

        newPairs.push({
          wordCard: {
            word: pair.word,
          },
          tempImageCard: {
            image: {
              src: URL.createObjectURL(blob),
              type: pair.imageFormat,
            },
          },
        });
      });

      setPairs(newPairs);
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

    let inputPairs: app.InputPair[] = [];
    let counter = 0;
    for (const pair of pairs) {
      counter++;

      let binaryImage;
      try {
        binaryImage = await getBinaryFromUrl(
          pair.tempImageCard.image?.src as string,
        );
      } catch (error) {
        alert(error);
        return;
      }

      inputPairs.push({
        bytes: binaryImage,
        imageFormat: pair.tempImageCard.image?.type as string,
        word: pair.wordCard.word,
      });
    }

    try {
      await EditGame(
        gameID,
        gameTitle,
        newGameDescription,
        selectedCategoriesIDs,
        inputPairs,
      );
    } catch (error) {
      alert("Error editing game: " + error);
      return;
    }
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

  const manageFileUpdate = (he: any) => {
    setFiles(he);
  };

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

  const [files, setFiles] = useState<any>([]);

  return {
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
    handleRemovePair,
  };
};
