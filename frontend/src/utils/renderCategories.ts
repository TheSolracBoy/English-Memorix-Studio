import { database } from "../../wailsjs/go/models";

const maxVisibleCategoriesCount = 3;
export function renderCategories(game: database.Game) {
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
