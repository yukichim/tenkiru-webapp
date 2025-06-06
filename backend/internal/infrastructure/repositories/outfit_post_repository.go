package repositories

import (
	"errors"
	"fmt"
	"sync"

	"forecast-app/internal/domain/entities"
)

type InMemoryOutfitPostRepository struct {
	outfitPosts map[string]*entities.OutfitPost
	mutex       sync.RWMutex
}

func NewInMemoryOutfitPostRepository() *InMemoryOutfitPostRepository {
	return &InMemoryOutfitPostRepository{
		outfitPosts: make(map[string]*entities.OutfitPost),
	}
}

func (r *InMemoryOutfitPostRepository) Create(post *entities.OutfitPost) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if post.ID == "" {
		post.ID = fmt.Sprintf("outfit_%d", len(r.outfitPosts)+1)
	}

	r.outfitPosts[post.ID] = post
	return nil
}

func (r *InMemoryOutfitPostRepository) GetByID(id string) (*entities.OutfitPost, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	post, exists := r.outfitPosts[id]
	if !exists {
		return nil, errors.New("outfit post not found")
	}

	postCopy := *post
	return &postCopy, nil
}

func (r *InMemoryOutfitPostRepository) GetByUserID(userID string) ([]*entities.OutfitPost, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	var userPosts []*entities.OutfitPost
	for _, post := range r.outfitPosts {
		if post.UserID == userID {
			postCopy := *post
			userPosts = append(userPosts, &postCopy)
		}
	}

	return userPosts, nil
}

func (r *InMemoryOutfitPostRepository) GetAll() ([]*entities.OutfitPost, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	var allPosts []*entities.OutfitPost
	for _, post := range r.outfitPosts {
		postCopy := *post
		allPosts = append(allPosts, &postCopy)
	}

	return allPosts, nil
}

func (r *InMemoryOutfitPostRepository) Update(post *entities.OutfitPost) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.outfitPosts[post.ID]; !exists {
		return errors.New("outfit post not found")
	}

	r.outfitPosts[post.ID] = post
	return nil
}

func (r *InMemoryOutfitPostRepository) Delete(id string) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.outfitPosts[id]; !exists {
		return errors.New("outfit post not found")
	}

	delete(r.outfitPosts, id)
	return nil
}
