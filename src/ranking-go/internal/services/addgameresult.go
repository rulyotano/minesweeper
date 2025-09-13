package services

import (
	"context"

	"github.com/go-redis/redis/v8"
	"minesweeper.rulyotano.com/internal/models"
)

func (rs *RankingService) AddGameResult(ctx context.Context, gameResult *models.GameResult) error {
	key := rs.getKey(gameResult.GameSize)
	rankingKey := gameResult.GetRankingKey()
	score := float64(gameResult.TimeInMs)

	// Use ZADD with XX and LT flags to only add if the score is less than existing
	// XX: Only update elements that already exist
	// LT: Only update existing elements if the new score is less than the current score
	// If the element doesn't exist, we need to add it first
	pipe := rs.redisClient.TxPipeline()

	// Check if member exists
	exists := rs.redisClient.ZScore(ctx, key, rankingKey)
	if exists.Err() != nil {
		// Member doesn't exist, add it
		pipe.ZAdd(ctx, key, &redis.Z{
			Score:  score,
			Member: rankingKey,
		})
	} else {
		// Member exists, only update if new score is better (lower)
		currentScore, _ := exists.Result()
		if score < currentScore {
			pipe.ZAdd(ctx, key, &redis.Z{
				Score:  score,
				Member: rankingKey,
			})
		}
	}

	_, err := pipe.Exec(ctx)
	return err
}
