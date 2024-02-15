import { GameCard, ImageGameCardPlay, WordGameCardPlay } from "@/models";
import imgUrl from "@/assets/images/backImage.png";

interface GameCardProps {
  card: GameCard;
}
export default function GameCardUI({ card }: GameCardProps) {
  function isWordCard(): boolean {
    if ("word" in card) {
      return true;
    }
    return false;
  }
  return (
    <div className="relative">
      <div
        id={card.identifier + "_back_image"}
        className="absolute h-52 w-32 rounded-md bg-cover  filter transition-all hover:cursor-pointer"
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      ></div>

        <div
          id={card.identifier}
          className="flex h-52 w-32 bg-white items-center justify-center rounded-md border  overflow-hidden "
        >
        {
          isWordCard() ?
          <span className="p-2">{(card as WordGameCardPlay).word}</span>
          :
          <img className="overflow-hidden" src={(card as ImageGameCardPlay).image.src} alt="" />
        }

        </div>
    </div>
  );
}
