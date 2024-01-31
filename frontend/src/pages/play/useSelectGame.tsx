import { useEffect, useRef, useState } from "react";
import { LoadAllCategories, LoadGames } from "../../../wailsjs/go/app/App";
import { database } from "../../../wailsjs/go/models";
import { filterGames } from "./helpersFiltering";

export const useSelectGame = () => {
  const [games, setgames] = useState<database.Game[]>([]);
  const [allGames, setAllgames] = useState<database.Game[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null); // Persist the timeout between renders
  const [allCategories, setAllCatetories] = useState<database.Category[]>([]);
  const [categoriesFilter, setCategoriesFilter] = useState<database.Category[]>(
    [],
  );

  // Make a debounce when filtering to optimize resources
  function triggerFilter(
    newValue: string,
    categoriesFilter: database.Category[],
  ) {
    console.log("clear ");
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      console.log("Busca", newValue);
      const filteredGames = filterGames(allGames, newValue, categoriesFilter);
      setgames(filteredGames);
    }, 400);
  }

  function handleSearchInputChange(newValue: string) {
    setSearchInput(newValue);
    triggerFilter(newValue, categoriesFilter);
  }

  function handleFilterCategoriesChange(id: number) {}

  useEffect(() => {
    const load = async () => {
      try {
        const games = LoadGames();
        const categories = LoadAllCategories();
        setAllCatetories(await categories);
        setgames(await games);
        setAllgames(await games);
      } catch (error) {
        console.log("error in useeffect loading useSelectGamehook");
      }
    };
    load();

    return () => {};
  }, []);

  return {
    games,
    searchInput,
    setSearchInput,
    handleSearchInputChange,
    categoriesFilter,
    allCategories,
  };
};
