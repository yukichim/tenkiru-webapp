package repositories

import (
	"errors"
	"fmt"
	"sync"

	"forecast-app/internal/domain/entities"
)

// ユーザーリポジトリのインメモリ実装
type InMemoryUserRepository struct {
	// users ユーザーデータをメモリ上に保存するマップ
	// キー: ユーザーID、値: ユーザーエンティティ
	users map[string]*entities.User
	
	// mutex 読み書き排他制御用のミューテックス
	// 同時アクセス時のデータ競合を防止
	mutex sync.RWMutex
}

// NewInMemoryUserRepository インメモリユーザーリポジトリの新しいインスタンスを作成します
func NewInMemoryUserRepository() *InMemoryUserRepository {
	return &InMemoryUserRepository{
		users: make(map[string]*entities.User),
	}
}

// 新しいユーザーをリポジトリに追加
func (r *InMemoryUserRepository) Create(user *entities.User) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	// ユーザーIDの自動生成
	// 実際のDBでは UUID やオートインクリメントを使用
	if user.ID == "" {
		user.ID = fmt.Sprintf("user_%d", len(r.users)+1)
	}

	r.users[user.ID] = user
	return nil
}

// ユーザーIDでユーザー情報を取得
func (r *InMemoryUserRepository) GetByID(id string) (*entities.User, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	user, exists := r.users[id]
	if !exists {
		return nil, errors.New("ユーザーが見つかりません")
	}

	userCopy := *user
	return &userCopy, nil
}

// メールアドレスでユーザー情報を取得
func (r *InMemoryUserRepository) GetByEmail(email string) (*entities.User, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	// 全ユーザーを線形検索（非効率、実際のDBではインデックス使用）
	for _, user := range r.users {
		if user.Email == email {
			userCopy := *user
			return &userCopy, nil
		}
	}

	return nil, errors.New("ユーザーが見つかりません")
}

// 既存のユーザー情報を更新
func (r *InMemoryUserRepository) Update(user *entities.User) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.users[user.ID]; !exists {
		return errors.New("ユーザーが見つかりません")
	}

	r.users[user.ID] = user
	return nil
}

// ユーザー削除
func (r *InMemoryUserRepository) Delete(id string) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	if _, exists := r.users[id]; !exists {
		return errors.New("ユーザーが見つかりません")
	}

	delete(r.users, id)
	return nil
}
