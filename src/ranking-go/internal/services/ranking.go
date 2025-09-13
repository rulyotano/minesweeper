package services

import (
	"fmt"
	"strings"

	"github.com/go-redis/redis/v8"
	"minesweeper.rulyotano.com/internal/models"
)

type RankingService struct {
	redisClient *redis.Client
}

func NewRankingService(redisClient *redis.Client) *RankingService {
	return &RankingService{
		redisClient: redisClient,
	}
}

func (rs *RankingService) getKey(gameSize models.GameSize) string {
	return fmt.Sprintf("ranking-%s", strings.ToLower(string(gameSize)))
}

func (rs *RankingService) parseUserName(member string) string {
	// Remove "(mobile)" suffix if present
	if strings.HasSuffix(member, " (mobile)") {
		return strings.TrimSuffix(member, " (mobile)")
	}
	return member
}
