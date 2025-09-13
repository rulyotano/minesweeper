package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"minesweeper.rulyotano.com/internal/models"
	"minesweeper.rulyotano.com/internal/services"

	"github.com/gin-gonic/gin"
)

type RankingHandler struct {
	rankingService *services.RankingService
}

func NewRankingHandler(rankingService *services.RankingService) *RankingHandler {
	return &RankingHandler{
		rankingService: rankingService,
	}
}

// GetRanking handles GET /api/v1/ranking
func (rh *RankingHandler) GetRanking(c *gin.Context) {
	// Parse query parameters
	limitStr := c.DefaultQuery("limit", "15")
	gameSizeStr := c.DefaultQuery("gameSize", "beginner")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 15
	}

	// Validate game size
	gameSize := models.GameSize(strings.ToLower(gameSizeStr))
	if gameSize != models.GameSizeBeginner && 
	   gameSize != models.GameSizeIntermediate && 
	   gameSize != models.GameSizeExpert {
		gameSize = models.GameSizeBeginner
	}

	// Get ranking from service
	items, err := rh.rankingService.GetRanking(c.Request.Context(), gameSize, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to retrieve ranking",
		})
		return
	}

	c.JSON(http.StatusOK, models.RankingResponse{
		Items: items,
	})
}

// AddGameResult handles PUT /api/v1/ranking
func (rh *RankingHandler) AddGameResult(c *gin.Context) {
	var gameResult models.GameResult

	// Bind JSON request body
	if err := c.ShouldBindJSON(&gameResult); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
			"details": err.Error(),
		})
		return
	}

	// Validate game size
	gameSize := models.GameSize(strings.ToLower(string(gameResult.GameSize)))
	if gameSize != models.GameSizeBeginner && 
	   gameSize != models.GameSizeIntermediate && 
	   gameSize != models.GameSizeExpert {
		gameSize = models.GameSizeBeginner
	}
	gameResult.GameSize = gameSize

	// Set default device if not provided
	if gameResult.Device == "" {
		gameResult.Device = models.DeviceDesktop
	}

	// Add game result to ranking
	err := rh.rankingService.AddGameResult(c.Request.Context(), &gameResult)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("Failed to add game result: %s", err.Error()),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Game result added successfully",
	})
}