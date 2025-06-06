package repositories

import (
	"forecast-app/internal/domain/entities"
	"forecast-app/internal/infrastructure/weather"
)

type WeatherRepository struct {
	weatherAPI *weather.OpenWeatherMapAPI
}

func NewWeatherRepository(apiKey string) *WeatherRepository {
	return &WeatherRepository{
		weatherAPI: weather.NewOpenWeatherMapAPI(apiKey),
	}
}

func (r *WeatherRepository) GetByLocation(latitude, longitude float64) (*entities.WeatherCondition, error) {
	return r.weatherAPI.GetByLocation(latitude, longitude)
}
