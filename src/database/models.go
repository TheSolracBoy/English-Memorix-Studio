package database

type Category struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Games       []Game `gorm:"many2many:game_categories" json:"games"`
}

type Game struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Categories  []Category `gorm:"many2many:game_categories" json:"categories"`
	Pairs       []Pair     `json:"pairs"`
}

type Pair struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	GameID      uint   `json:"game_id"`
	Word        string `json:"word"`
	ImageFormat string `json:"image_format"`
	Bytes       []byte `json:"bytes"`
}
