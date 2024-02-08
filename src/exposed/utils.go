package app

import "github.com/wailsapp/wails/v2/pkg/runtime"

func CantConnectToDatabaseMessage(a *App) {

	runtime.MessageDialog(a.ctx, runtime.MessageDialogOptions{
		Type:    runtime.InfoDialog,
		Title:   "Database Error",
		Message: "Couldn't connect to database",
	})
}

func NotifyUser() {

}

func (app *App) AskUserForConfirmation(textPrompt string, title string) bool {

	options := runtime.MessageDialogOptions{
		Type:    runtime.QuestionDialog,
		Title:   title,
		Message: textPrompt,
		Buttons: []string{"Ok", "Cancel"},
	}
	result, err := runtime.MessageDialog(app.ctx, options)
	if err != nil {
		return false

	}
	if result == "Ok" {
		return true

	}
	return false

}

func (app *App) Alert(textPrompt string, title string) error {

	options := runtime.MessageDialogOptions{
		Type:    runtime.InfoDialog,
		Title:   title,
		Message: textPrompt,
	}
	_, err := runtime.MessageDialog(app.ctx, options)

	if err != nil {
		return err

	}
	return err
}
