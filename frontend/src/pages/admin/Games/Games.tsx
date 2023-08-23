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
import { EraseGame, LoadGames } from "../../../../wailsjs/go/app/App";
import { AdminLayout } from "../../../layouts/AdminLayout";
import { cleanLongTexts } from "../../../utils";
import { database } from "../../../../wailsjs/go/models";

const maxVisibleCategoriesCount = 3;

export const Games = () => {
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
    console.log("Re render");
  }, []);

  const [games, setGames] = useState<database.Game[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;

  async function loadGames() {
    const response = await LoadGames(rowsPerPage, (page - 1) * rowsPerPage);

    console.log(response);

    setGames(response);
  }

  async function handleEraseGame(id: number) {
    try {
      await EraseGame(id);
      loadGames();
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

  function renderCategories(game: database.Game) {
    if (game.categories.length === 0) {
      return "";
    }
    let categoriesText = game.categories[0].title;

    for (
      let index = 1;
      index < game.categories.length || index === maxVisibleCategoriesCount;
      index++
    ) {
      categoriesText += ", " + game.categories[index].title;
    }

    if (game.categories.length > 3) {
      categoriesText += "...";
    }

    return categoriesText;
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
                  onClick={() => handleEraseGame(game.id)}
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
