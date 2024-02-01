import { GameLayout } from "@/layouts/GameLayout";
import { useSelectGame } from "./useSelectGame";
import { database } from "../../../wailsjs/go/models";
import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { cleanLongTexts, renderCategories } from "@/utils";
import { LogoSplash } from "@/Components/LogoSplash";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input, Select, Space } from 'antd';
import type { SelectProps } from 'antd';


interface GameCardProps {
  game: database.Game;
}


export default function SelectGame() {
  const logic = useSelectGame();
  const navigator = useNavigate()

  const options: SelectProps['options'] = [];

  for (let i = 0; i < logic.allCategories.length; i++) {
    options.push({
      label: logic.allCategories[i].title,
      value: logic.allCategories[i].id,
    });
  }

  const handleChange = (value: string[]) => {
    logic.handleFilterCategoriesChange(value)
  };

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
          size="middle"
        ></Input>

        <h2 className=" mb-1 font-bold">Filter by category</h2>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          onChange={handleChange}
          options={options}
        />
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
                  <Link to={`${game.id}`}>
                    <Button size="sm" color="primary">
                      Play
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </GameLayout>
  );
}
