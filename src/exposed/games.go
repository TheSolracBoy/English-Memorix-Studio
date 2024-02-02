package app

import (
	"encoding/base64"
	"fmt"
	"strconv"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gorm.io/gorm"

	"tcu/src/database"
)

func (a *App) CreateNewGame(title string, description string, categories []uint) (string, error) {
	db, err := database.GetDatabase()
	if err != nil {
		return "", fmt.Errorf("NO_DATABASE")
	}
	//
	var game database.Game
	db.Where("title = ?", title).First(&game)
	//
	if game.ID != 0 {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Already used title",
			Message: "Pls choose another title for the game",
		})
		return "", fmt.Errorf("GAME_TITLE_EXISTS")
	}
	//
	newGame := database.Game{Title: title, Description: description}
	var categoriesFromDatabase []database.Category
	db.Where("id IN (?)", categories).Find(&categoriesFromDatabase)

	for _, category := range categoriesFromDatabase {
		db.Model(&newGame).Association("Categories").Append(&category)
	}
	//
	result := db.Create(&newGame)
	if result == nil {
		return "", fmt.Errorf("ERROR_CREATING_GAME")
	}

	db.Save(&newGame)

	return fmt.Sprint(newGame.ID), nil
}

func (a *App) LoadGames() ([]database.Game, error) {
	db, err := database.GetDatabase()
	if err != nil {
		return nil, err
	}

	var games []database.Game
	db.Preload("Categories").Find(&games)
	return games, nil
}

func (a *App) EraseGame(id uint) error {
	db, err := database.GetDatabase()
	if err != nil {

		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Couldn't connect to database",
		})
		return err
	}

	var game database.Game
	db.First(&game, id)
	if game.ID == 0 {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Game doesn't exist",
		})
		return fmt.Errorf("game doesn't exist")
	}

	db.Model(&game).Association("Categories").Clear()
	db.Unscoped().Delete(&game)

	if db.Error != nil {

		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Error deleting game",
		})
		db.Commit()
		return fmt.Errorf("ERROR_DELETING")
	}

	return nil
}

type PairsWithBase64Image struct {
	Word        string `json:"word"`
	ImageFormat string `json:"imageFormat"`
	Base64Image string `json:"base64Image"`
}

type GameInfo struct {
	Id    uint                   `json:"id"`
	Title string                 `json:"title"`
	Pairs []PairsWithBase64Image `json:"pairs"`
}

func (a *App) GetGameInfo(id uint) (GameInfo, error) {
	db, err := database.GetDatabase()
	if err != nil {
		CantConnectToDatabaseMessage(a)
	}

	var game database.Game

	db.Preload("Pairs").Preload("Categories").First(&game, id)

	if game.ID == 0 {
		return GameInfo{}, fmt.Errorf("couldn't create error")
	}

	response := GameInfo{
		Id:    game.ID,
		Title: game.Title,
		Pairs: []PairsWithBase64Image{},
	}

	for _, pair := range game.Pairs {
		bytes := pair.Bytes
		base64image := base64.StdEncoding.EncodeToString(bytes)
		response.Pairs = append(response.Pairs, PairsWithBase64Image{
			Word:        pair.Word,
			ImageFormat: pair.ImageFormat,
			Base64Image: base64image,
		})
	}

	return response, nil
}

type InputPair struct {
	Word        string `json:"word"`
	Bytes       []byte `json:"bytes"`
	ImageFormat string `json:"imageFormat"`
}

func (a *App) EditGame(
	id uint,
	title string,
	description string,
	categoriesIDS []uint,
	pairs []InputPair,
) (database.Game, error) {
	db, err := database.GetDatabase()
	if err != nil {
		CantConnectToDatabaseMessage(a)
	}
	var game database.Game
	db.Transaction(func(tx *gorm.DB) error {

		db.First(&game, id)
		if game.ID == 0 {
			return err
		}

		game.Title = title
		game.Description = description
		if err := db.Save(&game).Error; err != nil {
			return err
		}

		var categoriesFromDatabase []database.Category

		if err := db.Where("id IN (?)", categoriesIDS).Find(&categoriesFromDatabase).Error; err != nil {
			return err
		}
		if err := db.Model(&game).Association("Categories").Replace(categoriesFromDatabase); err != nil {
			return err
		}

		if err := tx.Delete(&database.Pair{}, "game_id = ?", id).Error; err != nil {
			return err
		}

		for _, pair := range pairs {

			//Create the pair
			var newPair database.Pair
			newPair.GameID = id
			newPair.Word = pair.Word
			newPair.Bytes = pair.Bytes
			newPair.ImageFormat = pair.ImageFormat
			if err := tx.Create(&newPair).Error; err != nil {
				return err
			}

		}
		return nil
	})

	return game, nil
}

func (a *App) GetCategoriesFromGame(id uint) ([]database.Category, error) {
	db, err := database.GetDatabase()
	if err != nil {
		CantConnectToDatabaseMessage(a)
	}
	var game database.Game
	db.First(&game, id)
	if game.ID == 0 {
		return nil, fmt.Errorf("GAME_DOESNT_EXIST")
	}

	var categories []database.Category
	db.Model(&game).Association("Categories").Find(&categories)

	return categories, nil
}

type PairWithBase64Image struct {
	Id          string `json:"id"`
	Word        string `json:"word"`
	ImageFormat string `json:"image_format"`
	Base64Image string `json:"base64_image"`
}

type GetPlayGameInfoReponse struct {
	GameTitle string                `json:"game_title"`
	Pairs     []PairWithBase64Image `json:"pairs"`
}

func (a *App) GetPlayGameInfo(id int32) (GetPlayGameInfoReponse, error) {
	var game database.Game
	db, err := database.GetDatabase()
	if err != nil {
		return GetPlayGameInfoReponse{}, fmt.Errorf("couldn't get database %v", err)

	}
	err = db.Where("id = ?", id).First(&game).Error
	if err != nil {
		return GetPlayGameInfoReponse{}, fmt.Errorf("didn't find game: %v", err)
	}

	response := GetPlayGameInfoReponse{
		Pairs:     []PairWithBase64Image{},
		GameTitle: game.Title,
	}

	var databasePairs []database.Pair
	err = db.Where("game_id = ?", id).Find(&databasePairs).Error
	if err != nil {
		return GetPlayGameInfoReponse{}, fmt.Errorf("couldn't find pairs: %v", err)
	}
	for _, pair := range databasePairs {
		bytes := pair.Bytes
		base64image := base64.StdEncoding.EncodeToString(bytes)
		response.Pairs = append(response.Pairs, PairWithBase64Image{
			Id:          strconv.FormatUint(uint64(pair.GameID), 10),
			Word:        pair.Word,
			ImageFormat: pair.ImageFormat,
			Base64Image: base64image,
		})

	}

	return response, nil

}
