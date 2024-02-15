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
          className=" h-52 w-32 items-center justify-center rounded-md border bg-white p-2 flex flex-col opacity-0"
        >
        {
          isWordCard() ?
          <span>{(card as WordGameCardPlay).word}</span>
          :

          <img src={(card as ImageGameCardPlay).image.src} alt="" />
        }

        </div>
    </div>
  );
}
