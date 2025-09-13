package models

import "time"

type GameSize string

const (
	GameSizeBeginner     GameSize = "beginner"
	GameSizeIntermediate GameSize = "intermediate"
	GameSizeExpert       GameSize = "expert"
)

type Device string

const (
	DeviceDesktop Device = "desktop"
	DeviceMobile  Device = "mobile"
)

type GameResult struct {
	TimeInMs  int       `json:"timeInMs" binding:"required,min=1000"`
	UserName  string    `json:"userName" binding:"required"`
	GameSize  GameSize  `json:"gameSize" binding:"required"`
	Device    Device    `json:"device"`
	DateTime  time.Time `json:"dateTime"`
}

func (gr *GameResult) GetRankingKey() string {
	key := gr.UserName
	if gr.Device == DeviceMobile {
		key += " (mobile)"
	}
	return key
}

type RankingItem struct {
	Position int    `json:"position"`
	TimeInMs int    `json:"timeInMs"`
	UserName string `json:"userName"`
}

type RankingResponse struct {
	Items []RankingItem `json:"items"`
}
