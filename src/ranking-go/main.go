package main

import (
	"log"
	"os"

	"minesweeper.rulyotano.com/internal/handlers"
	"minesweeper.rulyotano.com/internal/redis"
	"minesweeper.rulyotano.com/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize Redis client
	redisClient, err := redis.NewClient()
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}
	defer redisClient.Close()

	// Initialize services
	rankingService := services.NewRankingService(redisClient.Client)

	// Initialize handlers
	rankingHandler := handlers.NewRankingHandler(rankingService)

	// Setup router
	router := gin.Default()

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Setup routes
	v1 := router.Group("/api/v1")
	{
		ranking := v1.Group("/ranking")
		{
			ranking.GET("", rankingHandler.GetRanking)
			ranking.PUT("", rankingHandler.AddGameResult)
		}
	}

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "80"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
