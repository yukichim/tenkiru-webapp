package entities

import (
	"errors"
	"time"
)

// 気象条件を表現するエンティティ
type WeatherCondition struct {
	Temperature float64
	
	FeelsLike   float64
	
	Description string
	
	Condition   string
	
	Humidity    int
	
	WindSpeed   float64
	
	CloudCover  int
	
	Location    string
	
	DateTime    time.Time
}

// ファッション推奨結果を表現するエンティティ
type FashionRecommendation struct {
	ID        string
	
	UserID    string
	
	Style     string
	
	Items     []RecommendedItem
	
	Weather   WeatherCondition
	
	Reason    string
	
	Location  string
	
	CreatedAt time.Time
}

// 推奨される衣服アイテムの詳細
type RecommendedItem struct {
	Category string
	
	Name     string
	
	Color    string
	
	Reason   string
}

// ユーザーの outfit 投稿を表現するエンティティ
type OutfitPost struct {
	ID          string
	
	UserID      string
	
	UserName    string
	
	Items       []string
	
	Description string
	
	Tags        []string
	
	Weather     WeatherCondition
	
	Temperature float64
	
	Location    string
	
	ImageURL    string

	CreatedAt   time.Time
	
	Likes       int
}

// outfit投稿データの検証
func (o *OutfitPost) Validate() error {
	if o.UserID == "" {
		return errors.New("ユーザーIDは必須です")
	}
	if len(o.Items) == 0 {
		return errors.New("少なくとも1つの衣服アイテムが必要です")
	}
	return nil
}

// WeatherData 現在の気象情報を表現する簡易エンティティ
type WeatherData struct {
	Temperature float64
	
	Condition   string
	
	Humidity    int
	
	WindSpeed   float64
	
	Location    string
	
	DateTime    time.Time
}

// OutfitSuggestion 完全なoutfit提案を表現するエンティティ
type OutfitSuggestion struct {
	WeatherCondition string
	
	Temperature      float64
	
	ClothingItems    []Clothing
	
	Description      string
	
	CreatedAt        time.Time
}

// ファッションスタイルの種類を定義
type Style string

const (
	StyleCasual Style = "casual"
	
	StyleFormal Style = "formal"
	
	StyleSporty Style = "sporty"
)

// 指定されたスタイルが有効かどうかを検証
func IsValidStyle(style string) bool {
	validStyles := []Style{StyleCasual, StyleFormal, StyleSporty}
	for _, valid := range validStyles {
		if Style(style) == valid {
			return true
		}
	}
	return false
}
