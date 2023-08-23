package app

import (
	"errors"
	"fmt"
	"tcu/src/database"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) CreateNewCategory(title string) (string, error) {
	db, err := database.GetDatabase()
	if err != nil {
		return "", err
	}

	var category database.Category
	db.Where("title = ?", title).First(&category)

	if category.ID != 0 {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Category already exists",
		})
		return "", errors.New("category Exists")
	}

	newCategory := database.Category{Title: title}

	result := db.Create(&newCategory)
	if result == nil {

		return "", errors.New("crror Creating")
	}

	return fmt.Sprint(newCategory.ID), nil
}

func (a *App) LoadCategories(count int, skip int) ([]database.Category, error) {
	db, err := database.GetDatabase()
	if err != nil {
		return nil, errors.New("NO_DATABASE")
	}

	var categories []database.Category
	db.Limit(10).Offset(skip).Find(&categories)
	//Return categories to client side here
	return categories, nil
}

func (a *App) LoadAllCategories() ([]database.Category, error) {
	db, err := database.GetDatabase()
	if err != nil {
		return nil, fmt.Errorf("NO_DATABASE")
	}

	var categories []database.Category
	db.Find(&categories)
	//Return categories to client side here
	return categories, nil
}

func (a *App) EraseCategory(id int) string {
	db, err := database.GetDatabase()
	if err != nil {

		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Couldnt connect to database",
		})
		return "NO_DATABASE"
	}

	var category database.Category
	db.First(&category, id)
	if category.ID == 0 {

		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Category doesn't exist",
		})
		return "NO_CATEGORY"
	}

	var gamesAssiciated []database.Game

	db.Model(&category).Association("Games").Find(&gamesAssiciated)

	if len(gamesAssiciated) > 0 {
		gamesTitles := ""
		for _, game := range gamesAssiciated {
			gamesTitles += "'" + game.Title + "'" + ", "
		}
		gamesTitles = gamesTitles[:len(gamesTitles)-2]

		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Unable to delete category",
			Message: "This category is associated with: " + gamesTitles + " game(s). Please remove the association before deleting this category",
		})
		return "CATEGORY_ASSOCIATED_WITH_GAMES"
	}

	db.Model(&category).Association("Games").Clear()
	db.Unscoped().Delete(&category)

	if db.Error != nil {

		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Error Deleting Category",
		})
		return "ERROR_DELETING"
	}

	return "OK"
}

func (a *App) EditCategory(id uint, newTitle string) error {
	db, err := database.GetDatabase()
	if err != nil {
		return errors.New("Database unset")
	}

	var category database.Category
	var categoryWithSameTitle database.Category

	db.Where("title = ?", newTitle).First(&categoryWithSameTitle)

	if categoryWithSameTitle.ID != 0 {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "There is another category with the same title",
		})
		return errors.New("CATEGORY_EXISTS")
	}

	db.First(&category, id)

	if category.ID == 0 {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Category doesn't exist",
		})

		return errors.New("ERROR_EDITING")
	}

	category.Title = newTitle
	db.Save(&category)
	return nil
}

func (a *App) LoadCategoryName(id int) (string, error) {
	db, err := database.GetDatabase()
	if err != nil {
		return "", err
	}

	var category database.Category
	db.First(&category, id)
	if category.ID == 0 {
		runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
			Type:    runtime.InfoDialog,
			Title:   "Database Error",
			Message: "Category doesn't exist",
		})
		return "", errors.New("Error Editing")
	}

	return category.Title, nil

}
