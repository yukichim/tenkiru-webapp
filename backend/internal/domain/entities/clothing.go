package entities

import (
	"errors"
	"time"
)

// ユーザーのクローゼット内の衣類アイテムを表現
type ClothingItem struct {
	ID          string    // ユニークな識別子
	UserID      string    // 所有者のユーザーID
	Name        string    // アイテム名
	Type        string    // 衣類の種類（シャツ、パンツなど）
	Color       string    // 色
	Category    string    // カテゴリ（トップス、ボトムスなど）
	Brand       string    // ブランド名
	WarmthLevel int       // 保温レベル（1-10、天気推奨で使用）
	ImageURL    string    // アイテムの画像URL
	CreatedAt   time.Time // 登録日時
}

//有効な衣類カテゴリ定義
type ClothingCategory string

const (
	CategoryTops       ClothingCategory = "トップス"      // シャツ、Tシャツ、ブラウスなど
	CategoryBottoms    ClothingCategory = "ボトムス"      // パンツ、スカート、ショーツなど
	CategoryOuterwear  ClothingCategory = "アウター"      // ジャケット、コート、カーディガンなど
	CategoryShoes      ClothingCategory = "シューズ"      // 靴、ブーツ、サンダルなど
	CategoryAccessory  ClothingCategory = "アクセサリー"    // 帽子、バッグ、アクセサリーなど
)

// バリデーション付きで新しい衣類アイテムを作成
func NewClothingItem(userID, name, itemType, color, category string) (*ClothingItem, error) {
	if userID == "" {
		return nil, errors.New("user ID is required")
	}
	if name == "" {
		return nil, errors.New("name is required")
	}
	if itemType == "" {
		return nil, errors.New("type is required")
	}
	if color == "" {
		return nil, errors.New("color is required")
	}
	if category == "" {
		return nil, errors.New("category is required")
	}

	return &ClothingItem{
		UserID:    userID,
		Name:      name,
		Type:      itemType,
		Color:     color,
		Category:  category,
		CreatedAt: time.Now(),
	}, nil
}

// 衣類のカテゴリが有効であるかを確認
func (c *ClothingItem) IsValidCategory() bool {
	validCategories := []ClothingCategory{
		CategoryTops, CategoryBottoms, CategoryOuterwear, CategoryShoes, CategoryAccessory,
	}
	
	for _, valid := range validCategories {
		if ClothingCategory(c.Category) == valid {
			return true
		}
	}
	return false
}

// 衣類アイテムの整合性を検証
func (c *ClothingItem) Validate() error {
	if c.UserID == "" {
		return errors.New("user ID is required")
	}
	if c.Name == "" {
		return errors.New("name is required")
	}
	if c.Type == "" {
		return errors.New("type is required")
	}
	if c.Color == "" {
		return errors.New("color is required")
	}
	if c.Category == "" {
		return errors.New("category is required")
	}
	return nil
}

type Clothing struct {
	ID       int
	Name     string
	Category string
	Color    string
	Type     string
}
