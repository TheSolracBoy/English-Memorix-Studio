import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AskUserForConfirmation, EraseGame, LoadGames } from "../../../../wailsjs/go/app/App";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { cleanLongTexts, renderCategories } from "../../../utils";
import { database } from "../../../../wailsjs/go/models";

export const Games = () => {
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const [games, setGames] = useState<database.Game[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  async function loadGames() {
    const response = await LoadGames();
    setGames(response);
  }

  async function handleEraseGame(id: number, name: string) {
    try {
      const userWantsToEraseTheGame = await AskUserForConfirmation("Erase Game",
        "Do you want to erase the game: " + name + " and loose all it's content?")
      if (userWantsToEraseTheGame) {
        await EraseGame(id);
        loadGames();
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleEditGame(id: number) {
    navigate(`edit/${id}`);
  }

  function handleAddGameButton() {
    navigate("newGame");
  }

  return (
    <AdminLayout title="Games">
      <Table className="mt-4">
        <TableHeader>
          <TableColumn className="text-center">
            <span>Title</span>
          </TableColumn>
          <TableColumn className="text-center">
            <span>Description</span>
          </TableColumn>
          <TableColumn className="text-center">
            <span>Categories</span>
          </TableColumn>
          <TableColumn className="text-center">
            <span>Edit</span>
          </TableColumn>
          <TableColumn className="text-center">
            <span className="text-center">Erase</span>
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No Games yet">
          {games.map((game) => (
            <TableRow key={game.id} className="text-center ">
              <TableCell>{game.title}</TableCell>
              <TableCell>{cleanLongTexts(game.description)}</TableCell>
              <TableCell>
                {game.categories.length === 0 ? (
                  <span className="italic text-gray-400">No Categories</span>
                ) : (
                  <span className="text-gray-600">
                    {renderCategories(game)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEditGame(game.id)}
                  size="sm"
                  color="success"
                >
                  Edit
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleEraseGame(game.id, game.title)}
                  size="sm"
                  color="danger"
                >
                  Erase
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={handleAddGameButton}
        type="submit"
        className="ml-auto mt-2 flex self-end "
        size="md"
        color="primary"
      >
        Add new Game
      </Button>
    </AdminLayout>
  );
};
