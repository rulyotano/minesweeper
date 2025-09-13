package config

import (
	"os"
)

type Config struct {
	RedisURL      string
	RedisPassword string
}

func Load() *Config {
	return &Config{
		RedisURL:      getEnv("REDIS_URL", "localhost:6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
