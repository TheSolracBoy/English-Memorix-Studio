package app

import (
	"encoding/base64"
	"os"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type File struct {
	Type   string `json:"type"`
	Base64 string `json:"base64"`
}

func (a *App) LoadImageFromFile() (File, error) {

	selection, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Image (*.jpg;*.jpeg;*.png;*.webp)",
				Pattern:     "*.jpg;*.jpeg;*.png;*.webp",
			},
		},
	})
	if err != nil {
		return File{}, err
	}

	// Open file, reads file and close it
	// Extract content as []byte
	bytes, err := os.ReadFile(selection)
	if err != nil {
		return File{}, err
	}

	//Bytes to base 64
	base64String := base64.StdEncoding.EncodeToString(bytes)

	format := ""
	for i := len(selection) - 1; i > 0; i-- {
		if selection[i] == '.' {
			format = selection[i+1:]
		}
	}

	format = "image/" + format

	return File{
		Type:   format,
		Base64: base64String,
	}, nil
}
