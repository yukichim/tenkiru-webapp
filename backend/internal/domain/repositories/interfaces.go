package repositories

import (
	"forecast-app/internal/domain/entities"
)

// UserRepository ユーザーデータアクセスのためのリポジトリインターフェース
// ユーザー情報の永続化層への操作を定義します。
type UserRepository interface {
	// Create 新しいユーザーを作成します
	// パスワードはハッシュ化された状態で保存されることを前提とします
	Create(user *entities.User) error
	
	// GetByID ユーザーIDでユーザー情報を取得します
	// ユーザーが存在しない場合は nil, error を返します
	GetByID(id string) (*entities.User, error)
	
	// GetByEmail メールアドレスでユーザー情報を取得します
	// 認証時のユーザー検索に使用されます
	GetByEmail(email string) (*entities.User, error)
	
	// Update 既存のユーザー情報を更新します
	// 存在しないユーザーの場合はエラーを返します
	Update(user *entities.User) error
	
	// Delete ユーザーIDでユーザーを削除します
	// 関連する衣服アイテムやファッション推奨も併せて削除される可能性があります
	Delete(id string) error
}

// ClothingRepository 衣服アイテムデータアクセスのためのリポジトリインターフェース
type ClothingRepository interface {
	// Create 新しい衣服アイテムをユーザーのクローゼットに追加します
	// アイテムの種類、色、サイズ、季節などの情報を保存します
	Create(item *entities.ClothingItem) error
	
	// GetByUserID 指定したユーザーの全ての衣服アイテムを取得します
	// クローゼット表示やコーディネート提案に使用されます
	GetByUserID(userID string) ([]*entities.ClothingItem, error)
	
	// GetByID 衣服アイテムIDで特定のアイテムを取得します
	GetByID(id string) (*entities.ClothingItem, error)
	
	// Update 既存の衣服アイテム情報を更新します
	// 着用回数やお気に入り状態の更新などに使用されます
	Update(item *entities.ClothingItem) error
	
	// Delete 衣服アイテムをクローゼットから削除します
	Delete(id string) error
}

// WeatherRepository 気象データアクセスのためのリポジトリインターフェース
type WeatherRepository interface {
	// GetByLocation 緯度経度から現在の天気情報を取得します
	// 気温、湿度、風速、降水確率、天気状況などの詳細情報を返します
	// ファッション推奨エンジンで使用される主要なデータソースです
	GetByLocation(latitude, longitude float64) (*entities.WeatherCondition, error)
}

// FashionRecommendationRepository ファッション推奨データアクセスのためのリポジトリインターフェース
// AI/機械学習によるファッション推奨結果の永続化と履歴管理を行います。
// ユーザーの過去の推奨履歴や好みの学習に使用されます。
type FashionRecommendationRepository interface {
	// Create 新しいファッション推奨を保存します
	// 天気条件、推奨された衣服の組み合わせ、信頼度スコアなどを保存します
	Create(recommendation *entities.FashionRecommendation) error
	
	// GetByID 推奨IDで特定のファッション推奨を取得します
	GetByID(id string) (*entities.FashionRecommendation, error)
	
	// GetByUserID 指定したユーザーのファッション推奨履歴を取得します
	// 過去の推奨結果の参照や学習データとして使用されます
	GetByUserID(userID string) ([]*entities.FashionRecommendation, error)
	
	// Update 既存のファッション推奨を更新します
	// ユーザーフィードバックによる評価更新などに使用されます
	Update(recommendation *entities.FashionRecommendation) error
	
	// Delete ファッション推奨を削除します
	Delete(id string) error
}

// OutfitPostRepository outfit投稿データアクセスのためのリポジトリインターフェース
// ユーザー間でのファッションコーディネート共有機能を実現します。
type OutfitPostRepository interface {
	// Create 新しいoutfit投稿を作成します
	// 画像、説明、天気情報、使用した衣服アイテムなどを保存します
	Create(post *entities.OutfitPost) error
	
	// GetByUserID 指定したユーザーの全てのoutfit投稿を取得します
	// ユーザープロフィール画面での投稿履歴表示に使用されます
	GetByUserID(userID string) ([]*entities.OutfitPost, error)
	
	// GetByID 投稿IDで特定のoutfit投稿を取得します
	GetByID(id string) (*entities.OutfitPost, error)
	
	// GetAll 全ユーザーのoutfit投稿を取得します
	// フィード表示やファッションインスピレーション機能に使用されます
	// ページングやフィルタリングのサポートが必要な場合があります
	GetAll() ([]*entities.OutfitPost, error)
	
	// Update 既存のoutfit投稿を更新します
	// いいね数やコメントの更新などに使用されます
	Update(post *entities.OutfitPost) error
	
	// Delete outfit投稿を削除します
	Delete(id string) error
}
