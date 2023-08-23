package database

import (
	"errors"
	"fmt"
	"os"
	"regexp"

	"tcu/src/environment"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var database *gorm.DB

func DevDatabase() {
	if environment.DEV_ENV {
		path := "dev.db"
		_, error := os.Stat(path)

		// check if error is "file not exists"
		if os.IsNotExist(error) {
			println("Entra en crear")
			CreateNewDatabase(path)
		} else {
			println("Entra en cargar")
			LoadDatabase(path)
		}

	}
}

func CreateNewDatabase(path string) (*gorm.DB, error) {
	if database == nil {
		//Eliminate . from path and renaming
		fmt.Println("Creating single instance now.")
		regexAllBeforePoint := regexp.MustCompile("^[^.]*")
		cleanName := regexAllBeforePoint.FindString(path)
		newPath := cleanName + ".db"

		f, err := os.Create(newPath)
		if err != nil {
			return nil, err
		}
		println(f.Name())
		defer f.Close()

		db, err := gorm.Open(sqlite.Open(newPath), &gorm.Config{})
		db.AutoMigrate(&Category{}, &Game{}, &Pair{})

		if err != nil {
			panic("failed to connect database")
		}
		database = db
	} else {
		fmt.Println("Single instance already created.")
	}

	return database, nil
}

func LoadDatabase(path string) *gorm.DB {

	if database == nil {
		fmt.Println("Creating single instance now. from ")
		db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
		if err != nil {
			panic("failed to connect database")
		}
		database = db
		db.AutoMigrate(&Category{}, &Game{}, &Pair{})

		// db.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&TempImage{})

	} else {
		fmt.Println("Single instance already created.")
	}
	return database
}

func GetDatabase() (*gorm.DB, error) {
	if database == nil {
		return nil, errors.New("database is null")
	}
	return database, nil
}
