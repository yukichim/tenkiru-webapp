package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"forecast-app/internal/application/usecases"
)

type FashionHandler struct {
	fashionUseCase *usecases.FashionUseCase
}

func NewFashionHandler(fashionUseCase *usecases.FashionUseCase) *FashionHandler {
	return &FashionHandler{
		fashionUseCase: fashionUseCase,
	}
}

func (h *FashionHandler) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req usecases.RecommendationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	req.UserID = userID

	recommendation, err := h.fashionUseCase.GetRecommendations(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recommendation)
}

func (h *FashionHandler) GetUserRecommendations(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	recommendations, err := h.fashionUseCase.GetUserRecommendations(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recommendations)
}

func (h *FashionHandler) GetRecommendationsLegacy(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	latStr := r.URL.Query().Get("lat")
	lonStr := r.URL.Query().Get("lon")
	location := r.URL.Query().Get("location")

	if latStr == "" || lonStr == "" {
		http.Error(w, "Latitude and longitude are required", http.StatusBadRequest)
		return
	}

	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		http.Error(w, "Invalid latitude", http.StatusBadRequest)
		return
	}

	lon, err := strconv.ParseFloat(lonStr, 64)
	if err != nil {
		http.Error(w, "Invalid longitude", http.StatusBadRequest)
		return
	}

	userID, _ := r.Context().Value("user_id").(string)
	if userID == "" {
		userID = "anonymous"
	}

	req := usecases.RecommendationRequest{
		UserID:    userID,
		Latitude:  lat,
		Longitude: lon,
		Location:  location,
	}

	recommendation, err := h.fashionUseCase.GetRecommendations(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recommendation)
}
