export type Category = {
  ID: number;
  Title: string;
};

export interface Image {
  type?: string;
  src: string;
}
// Pair management

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
  wordCard: WordCard;
  imageCard: ImageCard;
};

export type TempPair = {
  wordCard: WordCard;
  tempImageCard: TempImageCard;
};
