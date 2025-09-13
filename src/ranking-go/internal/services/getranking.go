package services

import (
	"context"
	"fmt"

	"minesweeper.rulyotano.com/internal/models"
)

func (rs *RankingService) GetRanking(ctx context.Context, gameSize models.GameSize, limit int) ([]models.RankingItem, error) {
	key := rs.getKey(gameSize)

	// Get top N results with scores
	results, err := rs.redisClient.ZRangeWithScores(ctx, key, 0, int64(limit-1)).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get ranking from Redis: %w", err)
	}

	var items []models.RankingItem
	for i, result := range results {
		// Parse the member to extract username
		userName := rs.parseUserName(result.Member.(string))

		items = append(items, models.RankingItem{
			Position: i + 1,
			TimeInMs: int(result.Score),
			UserName: userName,
		})
	}

	return items, nil
}
