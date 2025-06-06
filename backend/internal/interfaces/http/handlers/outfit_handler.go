package handlers

import (
	"encoding/json"
	"net/http"
	"path"

	"forecast-app/internal/application/usecases"
)

type OutfitHandler struct {
	outfitUseCase *usecases.OutfitUseCase
}

func NewOutfitHandler(outfitUseCase *usecases.OutfitUseCase) *OutfitHandler {
	return &OutfitHandler{
		outfitUseCase: outfitUseCase,
	}
}

func (h *OutfitHandler) CreateOutfitPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req usecases.CreateOutfitPostRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	req.UserID = userID

	outfitPost, err := h.outfitUseCase.CreateOutfitPost(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(outfitPost)
}

func (h *OutfitHandler) GetAllOutfitPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	outfitPosts, err := h.outfitUseCase.GetAllOutfitPosts()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(outfitPosts)
}

func (h *OutfitHandler) GetUserOutfitPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	outfitPosts, err := h.outfitUseCase.GetOutfitPostsByUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(outfitPosts)
}

func (h *OutfitHandler) GetOutfitPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := path.Base(r.URL.Path)
	if id == "" {
		http.Error(w, "Outfit post ID is required", http.StatusBadRequest)
		return
	}

	outfitPost, err := h.outfitUseCase.GetOutfitPostByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(outfitPost)
}

func (h *OutfitHandler) LikeOutfitPost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
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
		http.Error(w, "Outfit post ID is required", http.StatusBadRequest)
		return
	}

	if err := h.outfitUseCase.LikeOutfitPost(id, userID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Outfit post liked successfully"}`))
}

func (h *OutfitHandler) DeleteOutfitPost(w http.ResponseWriter, r *http.Request) {
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
		http.Error(w, "Outfit post ID is required", http.StatusBadRequest)
		return
	}

	if err := h.outfitUseCase.DeleteOutfitPost(id, userID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
