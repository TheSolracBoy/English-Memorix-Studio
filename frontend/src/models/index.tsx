export type Category = {
  ID: number;
  Title: string;
};

export interface Image {
  type?: string;
  src: string;
}
// Pair management

export interface GameCard {
  pairID: string
  isHidden: boolean
  haveBeenGuessed: boolean
  identifier: string
}
export interface ImageGameCardPlay extends GameCard {
  image: Image
}
export interface WordGameCardPlay extends GameCard {
  word: string
}


export type WordCard = {
  word: string;
};

export type TempImageCard = {
  image: Image | null;
};

export type ImageCard = {
  ImageID: string;
};

export type Pair = {
  id: number;
  wordCard: WordCard;
  tempImageCard: TempImageCard;
};

export type TempPair = {
  wordCard: WordCard;
  tempImageCard: TempImageCard;
};
