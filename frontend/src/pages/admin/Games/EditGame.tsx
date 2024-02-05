import { Input, Button, Textarea, Divider as NDiv } from "@nextui-org/react";
import { SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "../../../layouts/AdminLayout";
import GameInfoEdit from "./EditGame/GameInfoEdit";
import UploadImage from "./EditGame/UploadIImag";
import { useEditGame } from "./EditGame/useEditGame";
import { Image } from "@/models/index";
import NewPairForm from "./EditGame/NewPairForm";
import Pair from "./EditGame/Pair";
import { Divider } from "antd";

export interface TempImage {
  type: string;
  bytes: Uint8Array;
}

export const EditGame = () => {
  const params = useParams();
  const {
    categories,
    gameTitle,
    setGameTitle,
    newGameDescription,
    setNewGameDescription,
    selectedCategoriesIDs,
    setSelectedCategoriesIDs,
    handleEditGame,
    handleCancelButton,
    showAddNewPair,
    handlerAddNewPair,
    handleSavePair,
    handleCancelAddNewPair,
    blob,
    setBlob,
    tempPair,
    handleChangeWordTempPair,
    handleChangeImage,
    pairs,
  } = useEditGame({ gameID: Number(params.id) });

  return (
    <AdminLayout title="Games">
      <h1 className="text-2xl font-semibold">Edit Game</h1>
      <div className="mt-2 flex flex-col " >
        <GameInfoEdit
          gameTitle={gameTitle}
          setGameTitle={setGameTitle}
          categories={categories}
          newGameDescription={newGameDescription}
          selectedCategoriesIDs={selectedCategoriesIDs}
          setNewGameDescription={setNewGameDescription}
          setSelectedCategoriesIDs={setSelectedCategoriesIDs}
        />
        <div className="mt-2">
          <span className="text-sm font-medium">Cards</span>
        </div>
        {pairs.length === 0 && !showAddNewPair && (
          <span className="mb-2 self-center">No pairs created</span>
        )}
        <div className="flex flex-col items-center justify-center gap-2">
          {pairs.map((pair, i) => {
            return (
              <Pair
                key={i}
                word={pair.wordCard.word}
                image={pair.tempImageCard.image}
              />
            );
          })}
        </div>
        {pairs.length > 0 && (
          <div className="mx-32">
            <Divider className="" />
          </div>
        )}

        {showAddNewPair && (
          <>
            <span className="self-center font-semibold ">New pair</span>
            <NewPairForm
              handleCancelAddPair={handleCancelAddNewPair}
              handleSaveNewPair={handleSavePair}
              pair={tempPair}
              handleChangeWordPair={handleChangeWordTempPair}
              handleChangeImage={handleChangeImage}
            />
          </>
        )}
        {!showAddNewPair && (
          <Button
            onClick={handlerAddNewPair}
            className="max-w-min self-center"
            size="sm"
          >
            Add new Pair
          </Button>
        )}
        <div className=" mt-5 flex  justify-end gap-2  ">
          <Button onClick={handleCancelButton} color="danger">
            Cancel
          </Button>
          <Button type="submit" color="primary" onClick={handleEditGame}>
            Edit Game
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};
