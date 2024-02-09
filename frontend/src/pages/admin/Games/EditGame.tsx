import { Button } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { AdminLayout } from "../../../layouts/AdminLayout";
import GameInfoEdit from "./EditGame/GameInfoEdit";
import { useEditGame } from "./EditGame/useEditGame";
import NewPairForm from "./EditGame/NewPairForm";
import Pair from "./EditGame/Pair";
import { Divider } from "antd";
import { PencilIcon, X } from "lucide-react";
import OldPairEditForm from "./EditGame/OldPairEditForm";

export interface TempImage {
  type: string;
  bytes: Uint8Array;
}

export const EditGame = () => {
  const params = useParams();
  const logic = useEditGame({ gameID: Number(params.id) });

  return (
    <AdminLayout title="Games">
      <h1 className="text-2xl font-semibold">Edit Game</h1>
      {
        logic.isLoadingSaveEdit ?
          <div className="flex flex-col justify-center items-center">
            <span>Loading</span>

          </div>
          :
          <div className="mt-2 flex flex-col " >
            <GameInfoEdit
              gameTitle={logic.gameTitle}
              setGameTitle={logic.setGameTitle}
              categories={logic.categories}
              newGameDescription={logic.newGameDescription}
              selectedCategoriesIDs={logic.selectedCategoriesIDs}
              setNewGameDescription={logic.setNewGameDescription}
              setSelectedCategoriesIDs={logic.setSelectedCategoriesIDs}
            />
            <div className="mt-2">
              <span className="text-sm font-medium">Cards</span>
            </div>
            {
              logic.isLoadingPairs ?
                <div className="flex flex-col justify-center items-center">
                  <span>Loading</span>
                </div>
                :
                <>
                  {logic.pairs.length === 0 && !logic.showAddNewPair && (
                    <span className="mb-2 self-center">No pairs created</span>
                  )}
                  <div className="flex flex-col items-center justify-center gap-2">
                    {logic.pairs.map((pair, i) => {
                      if (logic.editingSavedPairID !== null && i == logic.editingSavedPairID) {
                        return <OldPairEditForm handleCancelAddPair={logic.handleCancelEditingSavedPair} handleSaveNewPair={logic.handleSaveEditingOldPair} pair={pair} />
                      }

                      return (
                        <div className="flex  ">
                          <Pair
                            key={i}
                            word={pair.wordCard.word}
                            image={pair.tempImageCard.image}
                          />
                          <div className="ml-2  flex  items-start gap-2 mt-6">
                            <div onClick={() => { logic.handleEditSavedPair(i) }} className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-700/60 hover:cursor-pointer">
                              < PencilIcon size={20} />
                            </div>
                            <div onClick={() => logic.eliminateFromSavedCards(i)} className="p-2 bg-red-500 text-white rounded-full hover:cursor-pointer hover:bg-red-500/60">
                              <X size={20} />
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </>
            }
            {logic.pairs.length > 0 && (
              <div className="mx-32">
                <Divider className="" />
              </div>
            )}

            {logic.showAddNewPair && (
              <>
                <span className="self-center font-semibold ">New pair</span>
                <NewPairForm
                  handleCancelAddPair={logic.handleCancelAddNewPair}
                  handleSaveNewPair={logic.handleSavePair}
                  pair={logic.tempPair}
                  handleChangeWordPair={logic.handleChangeWordTempPair}
                  handleChangeImage={logic.handleChangeImage}
                />
              </>
            )}
            {!logic.showAddNewPair && (
              <Button
                onClick={logic.handlerAddNewPair}
                className="max-w-min self-center"
                size="sm"
              >
                Add new Pair
              </Button>
            )}
            <div className=" mt-5 flex  justify-end gap-2  ">
              <Button onClick={logic.handleCancelButton} color="danger">
                Cancel
              </Button>
              <Button type="submit" color="primary" onClick={logic.handleEditGame}>
                Edit Game
              </Button>
            </div>
          </div>
      }
    </AdminLayout>
  );
};
