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
    <>
      {card.isHidden && (
        <div
          className={
            "h-52 w-32 rounded-md bg-cover  filter transition-all " +
            (card.haveBeenGuessed ? "opacity-0" : "hover:cursor-pointer ")
          }
          style={{
            backgroundImage: `url(${imgUrl})`,
          }}
        ></div>
      )}
      {isWordCard() ? (
        <div
          id={card.pairID + "word"}
          className={
            " hidden h-52 w-32 items-center justify-center rounded-md border bg-white p-2 transition-all hover:cursor-pointer"
          }
        >
          <span>{(card as WordGameCardPlay).word}</span>
        </div>
      ) : (
        <div
          id={card.pairID + "image"}
          className={
            " hidden h-52 w-32 items-center justify-center rounded-md border bg-white p-2 transition-all hover:cursor-pointer"
          }
        >
          <img src={(card as ImageGameCardPlay).image.src} alt="" />
        </div>
      )}
    </>
  );
}
