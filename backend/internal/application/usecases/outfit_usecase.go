package usecases

import (
	"fmt"
	"time"

	"forecast-app/internal/domain/entities"
	"forecast-app/internal/domain/repositories"
)

type OutfitUseCase struct {
	outfitRepo repositories.OutfitPostRepository
}

func NewOutfitUseCase(outfitRepo repositories.OutfitPostRepository) *OutfitUseCase {
	return &OutfitUseCase{
		outfitRepo: outfitRepo,
	}
}

type CreateOutfitPostRequest struct {
	UserID      string   `json:"user_id"`
	UserName    string   `json:"user_name"`
	ImageURL    string   `json:"image_url"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
	Location    string   `json:"location"`
	Temperature float64  `json:"temperature"`
}

func (uc *OutfitUseCase) CreateOutfitPost(req CreateOutfitPostRequest) (*entities.OutfitPost, error) {
	outfitPost := &entities.OutfitPost{
		UserID:      req.UserID,
		UserName:    req.UserName,
		ImageURL:    req.ImageURL,
		Description: req.Description,
		Tags:        req.Tags,
		Location:    req.Location,
		Temperature: req.Temperature,
		Likes:       0,
		CreatedAt:   time.Now(),
	}

	// Validate outfit post
	if err := outfitPost.Validate(); err != nil {
		return nil, fmt.Errorf("invalid outfit post data: %w", err)
	}

	// Save outfit post
	if err := uc.outfitRepo.Create(outfitPost); err != nil {
		return nil, fmt.Errorf("failed to create outfit post: %w", err)
	}

	return outfitPost, nil
}

func (uc *OutfitUseCase) GetAllOutfitPosts() ([]*entities.OutfitPost, error) {
	return uc.outfitRepo.GetAll()
}

func (uc *OutfitUseCase) GetOutfitPostsByUser(userID string) ([]*entities.OutfitPost, error) {
	return uc.outfitRepo.GetByUserID(userID)
}

func (uc *OutfitUseCase) GetOutfitPostByID(id string) (*entities.OutfitPost, error) {
	return uc.outfitRepo.GetByID(id)
}

func (uc *OutfitUseCase) LikeOutfitPost(id string, userID string) error {
	outfitPost, err := uc.outfitRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("outfit post not found: %w", err)
	}

	// Increment likes
	outfitPost.Likes++

	// Save updated outfit post
	if err := uc.outfitRepo.Update(outfitPost); err != nil {
		return fmt.Errorf("failed to update outfit post: %w", err)
	}

	return nil
}

func (uc *OutfitUseCase) DeleteOutfitPost(id string, userID string) error {
	outfitPost, err := uc.outfitRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("outfit post not found: %w", err)
	}

	// Check if user owns this outfit post
	if outfitPost.UserID != userID {
		return fmt.Errorf("unauthorized: user does not own this outfit post")
	}

	return uc.outfitRepo.Delete(id)
}
