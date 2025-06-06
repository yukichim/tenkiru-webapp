package main

import (
	"log"
	"net/http"
	"os"

	"forecast-app/internal/application/usecases"
	"forecast-app/internal/domain/services"
	"forecast-app/internal/infrastructure/repositories"
	"forecast-app/internal/interfaces/http/handlers"
	"forecast-app/internal/interfaces/http/middleware"
)

func main() {
	// Get environment variables
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	weatherAPIKey := os.Getenv("WEATHER_API_KEY")
	if weatherAPIKey == "" {
		log.Println("Warning: WEATHER_API_KEY not set, using mock weather data")
		weatherAPIKey = "mock-key"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-secret-key-change-this-in-production"
		log.Println("Warning: Using default JWT secret. Set JWT_SECRET environment variable in production")
	}

	// リポジトリインスタンス生成
	userRepo := repositories.NewInMemoryUserRepository()
	clothingRepo := repositories.NewInMemoryClothingRepository()
	fashionRepo := repositories.NewInMemoryFashionRecommendationRepository()
	outfitRepo := repositories.NewInMemoryOutfitPostRepository()
	weatherRepo := repositories.NewWeatherRepository(weatherAPIKey)

	fashionService := services.NewFashionRecommendationService()

	// Initialize use cases (application layer)
	userUseCase := usecases.NewUserUseCase(userRepo, jwtSecret)
	clothingUseCase := usecases.NewClothingUseCase(clothingRepo)
	fashionUseCase := usecases.NewFashionUseCase(fashionService, weatherRepo, clothingRepo, fashionRepo)
	outfitUseCase := usecases.NewOutfitUseCase(outfitRepo)

	// Initialize handlers (interface layer)
	userHandler := handlers.NewUserHandler(userUseCase)
	clothingHandler := handlers.NewClothingHandler(clothingUseCase)
	fashionHandler := handlers.NewFashionHandler(fashionUseCase)
	outfitHandler := handlers.NewOutfitHandler(outfitUseCase)

	// Initialize middleware
	authMiddleware := middleware.NewAuthMiddleware(userUseCase)

	// Setup routes
	setupRoutes(userHandler, clothingHandler, fashionHandler, outfitHandler, authMiddleware)

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

/*
	 ルーティング設定
*/ 
func setupRoutes(
	userHandler *handlers.UserHandler,
	clothingHandler *handlers.ClothingHandler,
	fashionHandler *handlers.FashionHandler,
	outfitHandler *handlers.OutfitHandler,
	authMiddleware *middleware.AuthMiddleware,
) {
	// Public routes
	http.HandleFunc("/api/register", authMiddleware.CORS(userHandler.Register))
	http.HandleFunc("/api/login", authMiddleware.CORS(userHandler.Login))
	
	// Fashion recommendations (legacy endpoint for compatibility)
	http.HandleFunc("/api/fashion-recommendations", authMiddleware.CORS(authMiddleware.OptionalAuth(fashionHandler.GetRecommendationsLegacy)))
	
	// Outfit posts (public read access)
	http.HandleFunc("/api/outfit-posts", authMiddleware.CORS(outfitHandler.GetAllOutfitPosts))

	// Protected routes (require authentication)
	http.HandleFunc("/api/profile", authMiddleware.CORS(authMiddleware.RequireAuth(userHandler.GetProfile)))
	http.HandleFunc("/api/clothing", authMiddleware.CORS(authMiddleware.RequireAuth(clothingHandler.CreateClothingItem)))
	http.HandleFunc("/api/clothing/", authMiddleware.CORS(authMiddleware.RequireAuth(clothingHandler.GetUserClothing)))
	http.HandleFunc("/api/recommendations", authMiddleware.CORS(authMiddleware.RequireAuth(fashionHandler.GetRecommendations)))
	http.HandleFunc("/api/outfit-posts/create", authMiddleware.CORS(authMiddleware.RequireAuth(outfitHandler.CreateOutfitPost)))
}

