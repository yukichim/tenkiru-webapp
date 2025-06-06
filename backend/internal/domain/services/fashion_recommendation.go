package services

import (
	"forecast-app/internal/domain/entities"
)

type FashionRecommendationService struct{}

func NewFashionRecommendationService() *FashionRecommendationService {
	return &FashionRecommendationService{}
}

func (s *FashionRecommendationService) RecommendClothing(weather *entities.WeatherData, userClothing []entities.Clothing) []entities.Clothing {
	recommendations := []entities.Clothing{}
	
	if weather.Temperature <= 0 {
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "冬服")...)
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "防寒具")...)
	} else if weather.Temperature <= 10 {
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "秋冬服")...)
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "ジャケット")...)
	} else if weather.Temperature <= 20 {
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "春秋服")...)
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "カーディガン")...)
	} else if weather.Temperature <= 25 {
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "春夏服")...)
	} else {
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "夏服")...)
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "Tシャツ")...)
	}
	
	switch weather.Condition {
	case "雨":
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "レインコート")...)
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "長靴")...)
	case "雪":
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "スノーブーツ")...)
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "手袋")...)
	case "晴れ":
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "サングラス")...)
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "帽子")...)
	}
	
	if weather.WindSpeed > 10 {
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "ウインドブレーカー")...)
	}
	
	if weather.Humidity > 70 {
		recommendations = append(recommendations, s.getClothingByCategory(userClothing, "通気性")...)
	}
	
	return s.removeDuplicates(recommendations)
}

func (s *FashionRecommendationService) getClothingByCategory(clothing []entities.Clothing, category string) []entities.Clothing {
	var filtered []entities.Clothing
	for _, item := range clothing {
		if item.Category == category {
			filtered = append(filtered, item)
		}
	}
	return filtered
}

func (s *FashionRecommendationService) removeDuplicates(clothing []entities.Clothing) []entities.Clothing {
	seen := make(map[int]bool)
	var unique []entities.Clothing
	
	for _, item := range clothing {
		if !seen[item.ID] {
			seen[item.ID] = true
			unique = append(unique, item)
		}
	}
	
	return unique
}

func (s *FashionRecommendationService) GenerateOutfitSuggestion(weather *entities.WeatherData, userClothing []entities.Clothing) *entities.OutfitSuggestion {
	recommendations := s.RecommendClothing(weather, userClothing)
	
	outfit := &entities.OutfitSuggestion{
		WeatherCondition: weather.Condition,
		Temperature:      weather.Temperature,
		ClothingItems:    recommendations,
		Description:      s.generateDescription(weather, recommendations),
	}
	
	return outfit
}

func (s *FashionRecommendationService) generateDescription(weather *entities.WeatherData, clothing []entities.Clothing) string {
	description := "今日の天気に適したコーディネートです。"
	
	if weather.Temperature <= 10 {
		description += "寒いので暖かい服装をおすすめします。"
	} else if weather.Temperature >= 25 {
		description += "暑いので涼しい服装をおすすめします。"
	}
	
	if weather.Condition == "雨" {
		description += "雨対策も忘れずに。"
	}
	
	return description
}

func (s *FashionRecommendationService) GenerateRecommendation(weather *entities.WeatherCondition, userClothing []*entities.ClothingItem) *entities.FashionRecommendation {
	var recommendedItems []entities.RecommendedItem
	
	var clothing []entities.Clothing
	for _, item := range userClothing {
		clothing = append(clothing, entities.Clothing{
			Name:     item.Name,
			Category: item.Category,
			Color:    item.Color,
			Type:     item.Type,
		})
	}
	
	weatherData := &entities.WeatherData{
		Temperature: weather.Temperature,
		Condition:   weather.Condition,
		Humidity:    weather.Humidity,
		WindSpeed:   weather.WindSpeed,
		Location:    weather.Location,
		DateTime:    weather.DateTime,
	}
	
	recommendations := s.RecommendClothing(weatherData, clothing)
	
	for _, item := range recommendations {
		recommendedItems = append(recommendedItems, entities.RecommendedItem{
			Category: item.Category,
			Name:     item.Name,
			Color:    item.Color,
			Reason:   s.getReasonForRecommendation(weather, item.Category),
		})
	}
	
	return &entities.FashionRecommendation{
		Style:   s.determineStyle(weather),
		Items:   recommendedItems,
		Weather: *weather,
		Reason:  s.generateDescription(weatherData, recommendations),
	}
}

func (s *FashionRecommendationService) getReasonForRecommendation(weather *entities.WeatherCondition, category string) string {
	if weather.Temperature <= 10 {
		return "寒い天気のため"
	} else if weather.Temperature >= 25 {
		return "暑い天気のため"
	}
	if weather.Condition == "雨" {
		return "雨天のため"
	}
	return "今日の天気に適しているため"
}

func (s *FashionRecommendationService) determineStyle(weather *entities.WeatherCondition) string {
	if weather.Temperature <= 10 {
		return "warm"
	} else if weather.Temperature >= 25 {
		return "cool"
	}
	return "casual"
}