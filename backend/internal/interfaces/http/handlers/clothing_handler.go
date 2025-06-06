package handlers

import (
	"encoding/json"
	"net/http"
	"path"

	"forecast-app/internal/application/usecases"
)

type ClothingHandler struct {
	clothingUseCase *usecases.ClothingUseCase
}

func NewClothingHandler(clothingUseCase *usecases.ClothingUseCase) *ClothingHandler {
	return &ClothingHandler{
		clothingUseCase: clothingUseCase,
	}
}

func (h *ClothingHandler) CreateClothingItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req usecases.CreateClothingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	req.UserID = userID

	clothing, err := h.clothingUseCase.CreateClothingItem(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(clothing)
}

func (h *ClothingHandler) GetUserClothing(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	clothing, err := h.clothingUseCase.GetUserClothing(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(clothing)
}

func (h *ClothingHandler) GetClothingItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := path.Base(r.URL.Path)
	if id == "" {
		http.Error(w, "Clothing item ID is required", http.StatusBadRequest)
		return
	}

	clothing, err := h.clothingUseCase.GetClothingByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(clothing)
}

func (h *ClothingHandler) UpdateClothingItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := path.Base(r.URL.Path)
	if id == "" {
		http.Error(w, "Clothing item ID is required", http.StatusBadRequest)
		return
	}

	var req usecases.CreateClothingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	clothing, err := h.clothingUseCase.UpdateClothingItem(id, userID, req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(clothing)
}

func (h *ClothingHandler) DeleteClothingItem(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := path.Base(r.URL.Path)
	if id == "" {
		http.Error(w, "Clothing item ID is required", http.StatusBadRequest)
		return
	}

	if err := h.clothingUseCase.DeleteClothingItem(id, userID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
