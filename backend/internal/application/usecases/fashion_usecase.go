package usecases

import (
	"fmt"
	"time"

	"forecast-app/internal/domain/entities"
	"forecast-app/internal/domain/repositories"
	"forecast-app/internal/domain/services"
)

// FashionUseCase ファッション推奨に関するビジネスロジックを実装するユースケース
type FashionUseCase struct {
	fashionService   *services.FashionRecommendationService
	
	weatherRepo      repositories.WeatherRepository
	
	clothingRepo     repositories.ClothingRepository
	
	recommendationRepo repositories.FashionRecommendationRepository
}

// ファッションユースケースの新しいインスタンスを作成
func NewFashionUseCase(
	fashionService *services.FashionRecommendationService,
	weatherRepo repositories.WeatherRepository,
	clothingRepo repositories.ClothingRepository,
	recommendationRepo repositories.FashionRecommendationRepository,
) *FashionUseCase {
	return &FashionUseCase{
		fashionService:     fashionService,
		weatherRepo:        weatherRepo,
		clothingRepo:       clothingRepo,
		recommendationRepo: recommendationRepo,
	}
}

// ファッション推奨リクエストの構造体
type RecommendationRequest struct {
	UserID    string  `json:"user_id"`    // 推奨対象ユーザーのID
	Latitude  float64 `json:"latitude"`   // 現在地の緯度（天気取得用）
	Longitude float64 `json:"longitude"`  // 現在地の経度（天気取得用）
	Location  string  `json:"location"`   // 地域名（表示用）
}

//  指定された位置情報と天気条件に基づいてファッション推奨
func (uc *FashionUseCase) GetRecommendations(req RecommendationRequest) (*entities.FashionRecommendation, error) {
	weatherCondition, err := uc.weatherRepo.GetByLocation(req.Latitude, req.Longitude)
	if err != nil {
		return nil, fmt.Errorf("天気データの取得に失敗しました: %w", err)
	}

	// ユーザーの衣服アイテムを取得
	clothingItems, err := uc.clothingRepo.GetByUserID(req.UserID)
	if err != nil {
		return nil, fmt.Errorf("ユーザーの衣服データの取得に失敗しました: %w", err)
	}

	// ドメインサービスを使用してファッション推奨を生成
	recommendation := uc.fashionService.GenerateRecommendation(weatherCondition, clothingItems)
	
	// 推奨結果に追加情報を設定
	recommendation.UserID = req.UserID
	recommendation.Location = req.Location
	recommendation.CreatedAt = time.Now()

	// 推奨結果を永続化
	if err := uc.recommendationRepo.Create(recommendation); err != nil {
		return nil, fmt.Errorf("推奨結果の保存に失敗しました: %w", err)
	}

	return recommendation, nil
}

// 指定されたユーザーの過去のファッション推奨履歴を取得
func (uc *FashionUseCase) GetUserRecommendations(userID string) ([]*entities.FashionRecommendation, error) {
	return uc.recommendationRepo.GetByUserID(userID)
}

// 特定のファッション推奨を ID で取得
func (uc *FashionUseCase) GetRecommendationByID(id string) (*entities.FashionRecommendation, error) {
	return uc.recommendationRepo.GetByID(id)
}
