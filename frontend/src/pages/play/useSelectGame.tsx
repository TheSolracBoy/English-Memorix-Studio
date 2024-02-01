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
  const categoriesFilterIDS = useRef<string[]>([])

  // Make a debounce when filtering to optimize resources
  function triggerFilter(
    gameTitleFilter: string,
    categoriesFilter: string[],
  ) {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(() => {
      const filteredGames = filterGames(allGames, categoriesFilter, gameTitleFilter,);
      setgames(filteredGames);
    }, 400);
  }

  function handleSearchInputChange(newGameTitleFilter: string) {
    setSearchInput(newGameTitleFilter);
    triggerFilter(newGameTitleFilter, categoriesFilterIDS.current);
  }

  function handleFilterCategoriesChange(newGameCategoriesIDSFilter: string[]) {
    categoriesFilterIDS.current = newGameCategoriesIDSFilter
    const filteredGames = filterGames(allGames, newGameCategoriesIDSFilter, searchInput,);
    setgames(filteredGames);
  }

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

    return () => { };
  }, []);

  return {
    games,
    searchInput,
    setSearchInput,
    handleSearchInputChange,
    handleFilterCategoriesChange,
    categoriesFilterIDS,
    allCategories,
  };
};
