import { database } from "../../../wailsjs/go/models";

export function filterGames(
  games: database.Game[],
  categoriesFilterIDS: string[],
  gameTitleFilter: string,
): database.Game[] {
  const filterByName = validNameFilter(gameTitleFilter);
  const filterByCategory = validDatabaseCategories(categoriesFilterIDS);

  if (!filterByName && !filterByCategory) {
    return games;
  }

  const gamesFiltered = games.filter((game) => {
    if (filterByName && !filterByCategory) {
      return hasFilteredGameName(game.title, gameTitleFilter);
    } else if (!filterByName && filterByCategory) {

      return hasFilteredCategories(categoriesFilterIDS, game);
    } else if (filterByName && filterByCategory) {
      return (
        hasFilteredGameName(game.title, gameTitleFilter) &&
        hasFilteredCategories(categoriesFilterIDS, game)
      );
    } else {
      return true;
    }
  });

  return gamesFiltered;
}

function hasFilteredGameName(gameName: string, filter: string): boolean {
  filter = filter.toUpperCase();
  filter = filter.replaceAll(" ", "");
  let gameTitle = "";

  gameTitle = gameName.toUpperCase();
  gameTitle = gameTitle.replaceAll(" ", "");
  return gameTitle.includes(filter);
}

function hasFilteredCategories(
  categoriesFilter: string[],
  game: database.Game,
): boolean {
  if (categoriesFilter.length == 0) {
    return true;
  }


  for (let index = 0; index < categoriesFilter.length; index++) {
    const categoriesFilterID = categoriesFilter[index];
    for (let gameCategoryIndex = 0; gameCategoryIndex < game.categories.length; gameCategoryIndex++) {

      const categoryID = game.categories[gameCategoryIndex].id;
      if (categoriesFilterID == categoryID.toString()) {
        return true
      }
    }
  }

  return false;
}

function validNameFilter(name?: string) {
  if (name) {
    if (name !== "") {
      return true;
    }
  }
  return false;
}

function validDatabaseCategories(categories?: string[]) {
  if (categories) {
    if (categories.length > 0) {
      return true;
    }
  }
  return false;
}
