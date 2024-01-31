import { database } from "../../../wailsjs/go/models";

function hasFilteredGameName(gameName: string, filter: string): boolean {
  filter = filter.toUpperCase();
  filter = filter.replaceAll(" ", "");
  let gameTitle = "";

  gameTitle = gameName.toUpperCase();
  gameTitle = gameTitle.replaceAll(" ", "");
  return gameTitle.includes(filter);
}

function hasFilteredCategories(
  categoriesFilter: database.Category[],
  game: database.Game,
): boolean {
  if (categoriesFilter.length == 0) {
    return true;
  }

  categoriesFilter.forEach((category) => {
    if (game.categories.includes(category)) {
      return true;
    }
  });
  return false;
}

function validNameFilter(name?: string) {
  if (name) {
    if (name !== "") {
      console.log("valid", name);
      return true;
    }
  }
  return false;
}

function validDatabaseCategories(categories?: database.Category[]) {
  if (categories) {
    if (categories.length > 0) {
      return true;
    }
  }
  return false;
}

export function filterGames(
  games: database.Game[],
  filter?: string,
  categories?: database.Category[],
): database.Game[] {
  const filterByName = validNameFilter(filter);
  const filterByCategory = validDatabaseCategories(categories);

  if (!filterByName && !filterByCategory) {
    return games;
  }

  console.log("Im filtering");
  const gamesFiltered = games.filter((game) => {
    if (filterByName && !filterByCategory) {
      console.log("first", filter);
      return hasFilteredGameName(game.title, filter as string);
    } else if (!filterByName && filterByCategory) {
      console.log("second", categories);
      return hasFilteredCategories(categories as database.Category[], game);
    } else if (filterByName && filterByCategory) {
      console.log("all", filter, categories);
      return (
        hasFilteredGameName(game.title, filter as string) &&
        hasFilteredCategories(categories as database.Category[], game)
      );
    } else {
      console.log("ultimate");
      return true;
    }
  });

  return gamesFiltered;
}
