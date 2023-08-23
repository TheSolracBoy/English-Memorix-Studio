package app

import (
	"context"
	"tcu/src/database"
	"tcu/src/environment"
)

// App struct
type App struct {
	ctx       context.Context
	imagePath string
}

// NewApp creates a new App application struct
func NewApp() *App {
	if environment.DEV_ENV {
		database.DevDatabase()
	}
	return &App{}

}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) IsDev() bool {
	return environment.DEV_ENV
}
