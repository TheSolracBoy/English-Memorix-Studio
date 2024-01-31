import { GameLayout } from "@/layouts/GameLayout";
import { useSelectGame } from "./useSelectGame";
import { database } from "../../../wailsjs/go/models";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { cleanLongTexts, renderCategories } from "@/utils";
import { LogoSplash } from "@/Components/LogoSplash";
import { Link } from "react-router-dom";

interface GameCardProps {
  game: database.Game;
}

export function GameRow(props: GameCardProps) {
  const game = props.game;
  return (
    <TableRow className="text-center ">
      <TableCell>{game.title}</TableCell>
      <TableCell>{cleanLongTexts(game.description)}</TableCell>
      <TableCell>
        {game.categories.length === 0 ? (
          <span className="italic text-gray-400">No Categories</span>
        ) : (
          <span className="text-gray-600">{renderCategories(game)}</span>
        )}
      </TableCell>
      <TableCell>
        <Button
          // onClick={() => handleEditGame(game.id)}
          size="sm"
          color="success"
        >
          Edit
        </Button>
      </TableCell>
      <TableCell>
        <Button
          // onClick={() => handleEraseGame(game.id)}
          size="sm"
          color="danger"
        >
          Erase
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function SelectGame() {
  const logic = useSelectGame();
  return (
    <GameLayout title="Select Game">
      <Link to={"/selectMode"} className="w-20">
        <LogoSplash variant="grey" />
      </Link>
      <h1 className="self-center text-3xl font-bold">Select Game</h1>
      <div>
        <h2 className="mb-1 font-bold">Search</h2>
        <Input
          value={logic.searchInput}
          onChange={(e) => {
            logic.handleSearchInputChange(e.target.value);
          }}
          placeholder="Search"
          size="sm"
        ></Input>

        <h2 className=" mb-1 font-bold">Filter by category</h2>
        <Select placeholder="Select categories" size="sm" multiple={true}>
          {logic.allCategories.map((category) => {
            return (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
            );
          })}
        </Select>
      </div>
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
            <span>Play</span>
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No games found">
          {logic.games.map((game) => {
            return (
              <TableRow key={game.id} className="text-center ">
                <TableCell>{game.title}</TableCell>
                <TableCell>{cleanLongTexts(game.description)}</TableCell>
                <TableCell>
                  {game.categories.length === 0 ? (
                    <span className="italic text-gray-400">-</span>
                  ) : (
                    <span className="text-gray-600">
                      {renderCategories(game)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button size="sm" color="primary">
                    Play
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </GameLayout>
  );
}
