
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
```

Now let me create a Dockerfile for containerization:

```dockerfile:/Users/ruly/projects/personal/minesweeper/src/ranking-go/Dockerfile
# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Expose port
EXPOSE 8080

# Run the application
CMD ["./main"]
```

And finally, let me create a .env.example file:

```env:/Users/ruly/projects/personal/minesweeper/src/ranking-go/.env.example
# Redis Configuration
REDIS_URL=localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Server Configuration
PORT=8080
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