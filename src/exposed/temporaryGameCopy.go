package app

import (
	"encoding/base64"
	"tcu/src/database"
)

func (a *App) CopyGame(id uint) error {
	db, err := database.GetDatabase()
	if err != nil {
		return err
	}

	err = db.Exec("DELETE from temporary_pairs where game_id = ? ", id).Error

	if err != nil {
		return err
	}

	var pairs []database.Pair
	if err := db.Where("game_id = ?", id).Find(&pairs).Error; err != nil {
		return err
	}

	for _, pair := range pairs {
		println("this is ")
		println(pair.Word)
		println(pair.ID)
		tempPair := database.TemporaryPair{
			ID:          pair.ID,
			GameID:      pair.GameID,
			Word:        pair.Word,
			ImageFormat: pair.ImageFormat,
			Bytes:       pair.Bytes,
		}
		err = db.Create(&tempPair).Error
		if err != nil {
			return err
		}
	}
	return nil
}

type AddPairToTemporaryInput struct {
	Word        string `json:"word"`
	GameId      uint   `json:"game_id"`
	Base64Image string `json:"base64_image"`
	ImageFormat string `json:"image_format"`
}

func (a *App) AddPairToTemporary(input AddPairToTemporaryInput) (index uint, err error) {
	db, err := database.GetDatabase()
	if err != nil {
		return 0, err
	}

	binary, err := base64.StdEncoding.DecodeString(input.Base64Image)
	if err != nil {
		return 0, err
	}

	newTemp := database.TemporaryPair{
		GameID:      input.GameId,
		Word:        input.Word,
		ImageFormat: input.ImageFormat,
		Bytes:       binary,
	}

	err = db.Create(&newTemp).Error
	if err != nil {
		return 0, nil
	}

	return newTemp.ID, nil
}

func (a *App) RemoveFromTemporary(tempPairID uint) error {
	db, err := database.GetDatabase()
	if err != nil {
		return err
	}

	err = db.Exec("DELETE from temporary_pairs where id = ? ", tempPairID).Error

	if err != nil {
		return err
	}
	return nil

}

func (a *App) EditFromTemporary(tempPairID uint, input AddPairToTemporaryInput) error {
	db, err := database.GetDatabase()
	if err != nil {
		return err
	}

	//base64 to binary

	binary, err := base64.StdEncoding.DecodeString(input.Base64Image)
	if err != nil {
		return err
	}

	tempPairWithID := database.TemporaryPair{
		ID:          tempPairID,
		GameID:      input.GameId,
		Word:        input.Word,
		ImageFormat: input.ImageFormat,
		Bytes:       binary,
	}

	err = db.Save(&tempPairWithID).Error
	if err != nil {
		return err
	}
	return nil

}
