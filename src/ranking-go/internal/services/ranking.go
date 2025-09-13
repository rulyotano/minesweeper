package services

import (
	"context"
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
