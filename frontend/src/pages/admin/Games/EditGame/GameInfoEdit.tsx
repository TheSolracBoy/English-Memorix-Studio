import { Input, Textarea } from "@nextui-org/react"
import { Select } from "antd"
import { DefaultOptionType } from "antd/es/select"

type GameInfoProps = {
  gameTitle: string
  setGameTitle: any

  newGameDescription: string
  setNewGameDescription: any
  selectedCategoriesIDs: number[]

  setSelectedCategoriesIDs: any

  categories: DefaultOptionType[] | undefined

}
export default function GameInfoEdit({ gameTitle, setGameTitle, newGameDescription, setNewGameDescription, selectedCategoriesIDs, categories, setSelectedCategoriesIDs }: GameInfoProps) {
  return (
    <>
      <Input
        isRequired={true}
        label="Title"
        labelPlacement="outside"
        value={gameTitle}
        aria-labelledby="Enter new game title"
        onValueChange={setGameTitle}
        type="text"
        placeholder="Enter game title"
      />
      <Textarea
        value={newGameDescription}
        onValueChange={setNewGameDescription}
        label="Description"
        labelPlacement="outside"
        placeholder="Enter game description"
        className="mt-2"
      />
      <div className="mt-2">
        <span className="text-sm font-medium">Categories</span>
        <Select
          mode="multiple"
          value={selectedCategoriesIDs}
          allowClear
          options={categories}
          placeholder="Select categories"
          style={{ width: "100%" }}
          onChange={setSelectedCategoriesIDs}
        />
      </div>
    </>
  )
}
