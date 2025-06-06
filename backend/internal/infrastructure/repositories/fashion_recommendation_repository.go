package repositories

import (
	"errors"
	"fmt"
	"sync"

	"forecast-app/internal/domain/entities"
)

type InMemoryFashionRecommendationRepository struct {
	recommendations map[string]*entities.FashionRecommendation
	mutex           sync.RWMutex
}

// NewInMemoryFashionRecommendationRepository インメモリのファッション推奨リポジトリを初期化します
func NewInMemoryFashionRecommendationRepository() *InMemoryFashionRecommendationRepository {
	return &InMemoryFashionRecommendationRepository{
		recommendations: make(map[string]*entities.FashionRecommendation),
	}
}

// Create 新しいファッション推奨をリポジトリに追加します
func (r *InMemoryFashionRecommendationRepository) Create(recommendation *entities.FashionRecommendation) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if recommendation.ID == "" {
		recommendation.ID = fmt.Sprintf("recommendation_%d", len(r.recommendations)+1)
	}

	r.recommendations[recommendation.ID] = recommendation
	return nil
}

// GetByID 指定したIDのファッション推奨を取得します
func (r *InMemoryFashionRecommendationRepository) GetByID(id string) (*entities.FashionRecommendation, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	recommendation, exists := r.recommendations[id]
	if !exists {
		return nil, errors.New("fashion recommendation not found")
	}

	recCopy := *recommendation
	return &recCopy, nil
}

// GetByUserID 指定したユーザーの全てのファッション推奨を取得します
func (r *InMemoryFashionRecommendationRepository) GetByUserID(userID string) ([]*entities.FashionRecommendation, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	var userRecommendations []*entities.FashionRecommendation
	for _, recommendation := range r.recommendations {
		if recommendation.UserID == userID {
			// Create a copy to prevent external modifications
			recCopy := *recommendation
			userRecommendations = append(userRecommendations, &recCopy)
		}
	}

	return userRecommendations, nil
}

// Update 既存のファッション推奨を更新します
func (r *InMemoryFashionRecommendationRepository) Update(recommendation *entities.FashionRecommendation) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.recommendations[recommendation.ID]; !exists {
		return errors.New("fashion recommendation not found")
	}

	r.recommendations[recommendation.ID] = recommendation
	return nil
}

func (r *InMemoryFashionRecommendationRepository) Delete(id string) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.recommendations[id]; !exists {
		return errors.New("fashion recommendation not found")
	}

	delete(r.recommendations, id)
	return nil
}
