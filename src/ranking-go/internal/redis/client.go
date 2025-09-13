package redis

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"minesweeper.rulyotano.com/internal/config"
)

type Client struct {
	*redis.Client
}

func NewClient() (*Client, error) {
	config := config.Load()
	rdb := redis.NewClient(&redis.Options{
		Addr: config.RedisURL,
		Password: config.RedisPassword,
		DB: 0,
	})

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := rdb.Ping(ctx).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %w", err)
	}

	return &Client{Client: rdb}, nil
}

func (c *Client) Close() error {
	return c.Client.Close()
}
