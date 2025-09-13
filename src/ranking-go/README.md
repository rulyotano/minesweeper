# Minesweeper Ranking API (Go)

A Go-based REST API for managing minesweeper game rankings using Redis as the backend storage.

## Features

- **GET /api/v1/ranking**: Retrieve game rankings from Redis sorted sets
- **PUT /api/v1/ranking**: Add new game results to rankings (only if better score)
- Redis integration with sorted sets for efficient ranking operations
- Support for different game sizes (beginner, intermediate, expert)
- Mobile/desktop device tracking

## Prerequisites

- Go 1.21 or higher
- Redis server running on localhost:6379 (or configure via environment variables)

## Installation

1. Install dependencies:
```bash
go mod tidy
```

2. Start Redis server:
```bash
redis-server
```

3. Run the application:
```bash
go run main.go
```

The API will be available at `http://localhost:8080`

## Environment Variables

- `REDIS_URL`: Redis server address (default: localhost:6379)
- `REDIS_PASSWORD`: Redis password (default: empty)
- `REDIS_DB`: Redis database number (default: 0)
- `PORT`: Server port (default: 8080)

## API Endpoints

### GET /api/v1/ranking

Retrieve the current ranking for a specific game size.

**Query Parameters:**
- `limit` (optional): Number of results to return (default: 15)
- `gameSize` (optional): Game size - beginner, intermediate, or expert (default: beginner)

**Example:**
```bash
curl "http://localhost:8080/api/v1/ranking?limit=10&gameSize=beginner"
```

**Response:**
```json
{
  "items": [
    {
      "position": 1,
      "timeInMs": 12000,
      "userName": "Player1"
    },
    {
      "position": 2,
      "timeInMs": 15000,
      "userName": "Player2 (mobile)"
    }
  ]
}
```

### PUT /api/v1/ranking

Add a new game result to the ranking. The result will only be added if it's better than the existing score for the same user.

**Request Body:**
```json
{
  "timeInMs": 12000,
  "userName": "Player1",
  "gameSize": "beginner",
  "device": "desktop"
}
```

**Example:**
```bash
curl -X PUT "http://localhost:8080/api/v1/ranking" \
  -H "Content-Type: application/json" \
  -d '{
    "timeInMs": 12000,
    "userName": "Player1",
    "gameSize": "beginner",
    "device": "desktop"
  }'
```

**Response:**
```json
{
  "message": "Game result added successfully"
}
```

## Data Structure

The API uses Redis sorted sets with the following key format:
- `ranking-{gameSize}` (e.g., `ranking-beginner`, `ranking-intermediate`, `ranking-expert`)

Each member in the sorted set represents a player with their best time as the score.

## Development

### Project Structure

```
├── main.go                 # Application entry point
├── internal/
│   ├── config/            # Configuration management
│   ├── handlers/          # HTTP request handlers
│   ├── models/            # Data models
│   ├── redis/             # Redis client
│   └── services/          # Business logic
└── go.mod                 # Go module file
```

### Running Tests

```bash
go test ./...
```

### Building

```bash
go build -o ranking-api main.go
```

## Docker Support

To run with Docker:

```bash
# Build the image
docker build -t minesweeper-ranking-go .

# Run the container
docker run -p 8080:8080 minesweeper-ranking-go
```

## Summary

I've created a complete Go API application with the following features:

### **Endpoints Created:**
1. **GET /api/v1/ranking** - Retrieves rankings from Redis sorted sets
2. **PUT /api/v1/ranking** - Adds game results to rankings (only if better score)

### **Key Features:**
- **Redis Integration**: Uses Redis sorted sets for efficient ranking operations
- **Conditional Updates**: Only adds/updates scores if the new score is better (lower time)
- **Game Size Support**: Supports beginner, intermediate, and expert game sizes
- **Device Tracking**: Tracks mobile vs desktop players
- **Input Validation**: Validates request data and provides proper error responses
- **CORS Support**: Includes CORS middleware for web client compatibility

### **Project Structure:**
- `main.go` - Application entry point with Gin router setup
- `internal/config/` - Configuration management
- `internal/handlers/` - HTTP request handlers for the API endpoints
- `internal/models/` - Data models and structures
- `internal/redis/` - Redis client wrapper
- `internal/services/` - Business logic for ranking operations
- `Dockerfile` - Container configuration
- `README.md` - Complete documentation

### **Redis Logic:**
The PUT endpoint implements the "only add if better" logic by:
1. Checking if the user already exists in the sorted set
2. If they don't exist, adding them
3. If they exist, only updating if the new score is better (lower time)

The application is ready to run with `go run main.go` after installing dependencies with `go mod tidy`.
