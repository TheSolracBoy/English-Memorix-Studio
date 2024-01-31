import { getBinaryFromUrl } from "./getBinaryFromUrl";
import { renderCategories } from "./renderCategories";
function cleanLongTexts(description: string): string {
  const maxLength = 50;
  const slicedDescription = description.slice(0, maxLength);
  if (description.length > maxLength) {
    return slicedDescription + "...";
  }

  return slicedDescription;
}

export { getBinaryFromUrl, cleanLongTexts, renderCategories };
