package repositories

import (
	"errors"
	"fmt"
	"sync"

	"forecast-app/internal/domain/entities"
)

type InMemoryClothingRepository struct {
	clothing map[string]*entities.ClothingItem
	mutex    sync.RWMutex
}

// NewInMemoryClothingRepository インメモリの衣服リポジトリを初期化します
func NewInMemoryClothingRepository() *InMemoryClothingRepository {
	return &InMemoryClothingRepository{
		clothing: make(map[string]*entities.ClothingItem),
	}
}

// Create 新しい衣服アイテムをリポジトリに追加します
func (r *InMemoryClothingRepository) Create(item *entities.ClothingItem) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if item.ID == "" {
		item.ID = fmt.Sprintf("clothing_%d", len(r.clothing)+1)
	}

	r.clothing[item.ID] = item
	return nil
}

// GetByID 指定したIDの衣服アイテムを取得します
func (r *InMemoryClothingRepository) GetByID(id string) (*entities.ClothingItem, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	item, exists := r.clothing[id]
	if !exists {
		return nil, errors.New("clothing item not found")
	}

	itemCopy := *item
	return &itemCopy, nil
}

// GetByUserID 指定したユーザーの全ての衣服アイテムを取得します
func (r *InMemoryClothingRepository) GetByUserID(userID string) ([]*entities.ClothingItem, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	var userClothing []*entities.ClothingItem
	for _, item := range r.clothing {
		if item.UserID == userID {
			itemCopy := *item
			userClothing = append(userClothing, &itemCopy)
		}
	}

	return userClothing, nil
}

// Update 既存の衣服アイテム情報を更新します
func (r *InMemoryClothingRepository) Update(item *entities.ClothingItem) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.clothing[item.ID]; !exists {
		return errors.New("clothing item not found")
	}

	r.clothing[item.ID] = item
	return nil
}

// Delete 指定したIDの衣服アイテムを削除します
func (r *InMemoryClothingRepository) Delete(id string) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.clothing[id]; !exists {
		return errors.New("clothing item not found")
	}

	delete(r.clothing, id)
	return nil
}
