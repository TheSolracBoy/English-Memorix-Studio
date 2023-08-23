package app

import "github.com/wailsapp/wails/v2/pkg/runtime"

func CantConnectToDatabaseMessage(a *App) {

	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    runtime.InfoDialog,
		Title:   "Database Error",
		Message: "Couldn't connect to database",
	})
}
