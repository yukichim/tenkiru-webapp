import { useState, useCallback } from 'react';
import type { WeatherCondition, WeatherForecast, WeatherAlert, Location } from '../types';
import { WeatherModel } from '../models/WeatherModel';
import { 
  WeatherConditionSchema, 
  WeatherForecastSchema, 
  WeatherAlertSchema 
} from '../utils/schemas';
import { apiClient } from '../utils/api-client';

interface UseWeatherControllerReturn {
  currentWeather: WeatherCondition | null;
  forecast: WeatherForecast | null;
  alerts: WeatherAlert[];
  isLoading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
  getWeatherByLocation: (location: Location) => Promise<void>;
  getWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  getWeatherWithValidation: (location: Location) => Promise<void>;
}

export const useWeatherController = (): UseWeatherControllerReturn => {
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);

  const weatherModel = new WeatherModel();

  const getWeatherByLocation = useCallback(async (location: Location) => {
    setIsLoading(true);
    setError(null);
    setLastLocation(location);

    try {
      const [weather, forecastData, alertsData] = await Promise.all([
        weatherModel.getCurrentWeather(location.lat, location.lon),
        weatherModel.getForecast(location.lat, location.lon),
        weatherModel.getWeatherAlerts(location.lat, location.lon)
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '天気データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [weatherModel]);

  const getWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    const location: Location = {
      lat,
      lon,
      name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    };
    await getWeatherByLocation(location);
  }, [getWeatherByLocation]);

  const refreshWeather = useCallback(async () => {
    if (lastLocation) {
      await getWeatherByLocation(lastLocation);
    }
  }, [lastLocation, getWeatherByLocation]);

  // Zodスキーマを使用した型安全なAPIメソッド
  const getWeatherWithValidation = useCallback(async (location: Location) => {
    setIsLoading(true);
    setError(null);
    setLastLocation(location);

    try {
      // 型安全なAPIコール
      const [weather, forecastData, alertsData] = await Promise.all([
        apiClient.safeGet(
          `/weather/current?lat=${location.lat}&lon=${location.lon}`,
          WeatherConditionSchema
        ),
        apiClient.safeGet(
          `/weather/forecast?lat=${location.lat}&lon=${location.lon}`,
          WeatherForecastSchema
        ),
        apiClient.safeGet(
          `/weather/alerts?lat=${location.lat}&lon=${location.lon}`,
          WeatherAlertSchema.array()
        )
      ]);

      setCurrentWeather(weather);
      setForecast(forecastData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '天気データの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentWeather,
    forecast,
    alerts,
    isLoading,
    error,
    refreshWeather,
    getWeatherByLocation,
    getWeatherByCoords,
    getWeatherWithValidation
  };
};
