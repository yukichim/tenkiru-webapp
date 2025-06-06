package usecases

import (
	"fmt"

	"forecast-app/internal/domain/entities"
	"forecast-app/internal/domain/repositories"
)

type ClothingUseCase struct {
	clothingRepo repositories.ClothingRepository
}

func NewClothingUseCase(clothingRepo repositories.ClothingRepository) *ClothingUseCase {
	return &ClothingUseCase{
		clothingRepo: clothingRepo,
	}
}

type CreateClothingRequest struct {
	UserID      string `json:"user_id"`
	Name        string `json:"name"`
	Category    string `json:"category"`
	Color       string `json:"color"`
	Brand       string `json:"brand"`
	ImageURL    string `json:"image_url"`
	WarmthLevel int    `json:"warmth_level"`
}

func (uc *ClothingUseCase) CreateClothingItem(req CreateClothingRequest) (*entities.ClothingItem, error) {
	clothing := &entities.ClothingItem{
		UserID:      req.UserID,
		Name:        req.Name,
		Category:    req.Category,
		Color:       req.Color,
		Brand:       req.Brand,
		ImageURL:    req.ImageURL,
		WarmthLevel: req.WarmthLevel,
	}

	if err := clothing.Validate(); err != nil {
		return nil, fmt.Errorf("invalid clothing item data: %w", err)
	}

	if err := uc.clothingRepo.Create(clothing); err != nil {
		return nil, fmt.Errorf("failed to create clothing item: %w", err)
	}

	return clothing, nil
}

func (uc *ClothingUseCase) GetUserClothing(userID string) ([]*entities.ClothingItem, error) {
	return uc.clothingRepo.GetByUserID(userID)
}

func (uc *ClothingUseCase) GetClothingByID(id string) (*entities.ClothingItem, error) {
	return uc.clothingRepo.GetByID(id)
}

func (uc *ClothingUseCase) UpdateClothingItem(id string, userID string, req CreateClothingRequest) (*entities.ClothingItem, error) {
	clothing, err := uc.clothingRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("clothing item not found: %w", err)
	}

	if clothing.UserID != userID {
		return nil, fmt.Errorf("unauthorized: user does not own this clothing item")
	}

	clothing.Name = req.Name
	clothing.Category = req.Category
	clothing.Color = req.Color
	clothing.Brand = req.Brand
	clothing.ImageURL = req.ImageURL
	clothing.WarmthLevel = req.WarmthLevel

	if err := clothing.Validate(); err != nil {
		return nil, fmt.Errorf("invalid clothing item data: %w", err)
	}

	if err := uc.clothingRepo.Update(clothing); err != nil {
		return nil, fmt.Errorf("failed to update clothing item: %w", err)
	}

	return clothing, nil
}

func (uc *ClothingUseCase) DeleteClothingItem(id string, userID string) error {
	clothing, err := uc.clothingRepo.GetByID(id)
	if err != nil {
		return fmt.Errorf("clothing item not found: %w", err)
	}

	if clothing.UserID != userID {
		return fmt.Errorf("unauthorized: user does not own this clothing item")
	}

	return uc.clothingRepo.Delete(id)
}
