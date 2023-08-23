import { Button, Input, Textarea, SelectItem, Chip } from "@nextui-org/react";

import { Select, Space } from "antd";
import type { SelectProps } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateNewGame,
  LoadAllCategories,
} from "../../../../wailsjs/go/app/App";
import { AdminLayout } from "../../../layouts/AdminLayout";

export const NewGame = () => {
  const navigate = useNavigate();

  const [newGameName, setNewGameName] = useState("");
  const [newGameDescription, setNewGameDescription] = useState("");
  const [categories, setCategories] = useState<SelectProps["options"]>();
  const [selectedCategoriesIDs, setSelectedCategoriesIDs] = useState<number[]>(
    [],
  );

  useEffect(() => {
    getCategories();
  }, []);
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

  function handleCancelButton() {
    navigate("../");
  }

  async function handleCreateNewGame(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const newGameID = await CreateNewGame(
        newGameName,
        newGameDescription,
        selectedCategoriesIDs,
      );
      setNewGameName("");
      setNewGameDescription("");
      navigate("../edit/" + newGameID);
    } catch (error) {
      setNewGameName("");
      return;
    }
  }

  return (
    <AdminLayout title="Games">
      <h1 className="text-2xl font-semibold">New Game</h1>

      <form
        className="mt-2 flex flex-1 flex-col  "
        onSubmit={handleCreateNewGame}
      >
        <Input
          isRequired={true}
          label="Title"
          labelPlacement="outside"
          value={newGameName}
          aria-labelledby="Enter new game title"
          onValueChange={setNewGameName}
          type="text"
          placeholder="Enter new Category name"
        />
        <Textarea
          value={newGameDescription}
          onValueChange={setNewGameDescription}
          label="Description"
          labelPlacement="outside"
          placeholder="Enter game description"
          className="mt-2"
        />
        <div className="mt-2">
          <span className="text-sm font-medium">Categories</span>

          <Select
            mode="multiple"
            allowClear
            options={categories}
            placeholder="Select categories"
            style={{ width: "100%" }}
            onChange={(value) => {
              setSelectedCategoriesIDs(value);
            }}
          />
        </div>
        <div className="     mt-2  flex justify-end gap-2  ">
          <Button onClick={handleCancelButton} color="danger">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Add new Game
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};
