import type {
  WeatherAlert,
  WeatherCondition,
  WeatherForecast,
  WeatherForecastDaily,
} from "../types";
import { ApiClient } from "../utils/api-client";

export class WeatherModel {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = ApiClient.getInstance();
  }

  async getCurrentWeather(lat: number, lon: number): Promise<WeatherCondition> {
    try {
      const response = (await this.apiClient.get(
        `/weather/current?lat=${lat}&lon=${lon}`
      )) as unknown as { data: WeatherCondition };
      return response.data;
    } catch (error) {
      // Fallback to mock data for development
      return this.getMockWeather(lat, lon);
    }
  }

  async getForecast(lat: number, lon: number): Promise<WeatherForecast> {
    try {
      const response = (await this.apiClient.get(
        `/weather/forecast?lat=${lat}&lon=${lon}`
      )) as unknown as { data: WeatherForecast };
      return response.data;
    } catch (error) {
      // Fallback to mock data for development
      return this.getMockForecast(lat, lon);
    }
  }

  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    try {
      const response = (await this.apiClient.get(
        `/weather/alerts?lat=${lat}&lon=${lon}`
      )) as unknown as { data: WeatherAlert[] };
      return response.data;
    } catch (error) {
      // Fallback to mock data for development
      return this.getMockAlerts();
    }
  }

  private getMockWeather(lat: number, lon: number): WeatherCondition {
    const conditions = ["sunny", "cloudy", "rainy", "snowy"];
    const randomCondition =
      conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = 20 + Math.random() * 10; // 20-30°C

    return {
      temperature: Math.round(baseTemp),
      feelsLike: Math.round(baseTemp + (Math.random() * 4 - 2)),
      humidity: Math.round(40 + Math.random() * 40), // 40-80%
      windSpeed: Math.round(Math.random() * 15), // 0-15 m/s
      windDirection: Math.round(Math.random() * 360),
      pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
      visibility: Math.round(8 + Math.random() * 2), // 8-10 km
      uvIndex: Math.round(Math.random() * 11), // 0-11
      condition: randomCondition,
      cloudCover: Math.round(Math.random() * 100),
      description: this.getWeatherDescription(randomCondition),
      location: `${lat}, ${lon}`,
      dateTime: new Date().toISOString(),
    };
  }

  private getMockForecast(lat: number, lon: number): WeatherForecast {
    const dailyForecasts: WeatherForecastDaily[] = [];
    const currentDate = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);

      const conditions = ["sunny", "cloudy", "rainy", "snowy"];
      const randomCondition =
        conditions[Math.floor(Math.random() * conditions.length)];
      const baseTemp = 15 + Math.random() * 15; // 15-30°C

      dailyForecasts.push({
        date: date.toISOString().split("T")[0],
        temperature: Math.round(baseTemp),
        feelsLike: Math.round(baseTemp + (Math.random() * 4 - 2)),
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        windSpeed: Math.round(Math.random() * 15), // 0-15 m/s
        windDirection: Math.round(Math.random() * 360),
        pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
        visibility: Math.round(8 + Math.random() * 2), // 8-10 km
        uvIndex: Math.round(Math.random() * 11), // 0-11
        condition: randomCondition,
        cloudCover: Math.round(Math.random() * 100),
        description: this.getWeatherDescription(randomCondition),
        location: `${lat}, ${lon}`,
        dateTime: date.toISOString(),
      });
    }

    return {
      location: { lat, lon },
      daily: dailyForecasts,
      hourly: [], // Could add hourly forecast here
      lastUpdated: new Date().toISOString(),
    };
  }

  private getMockAlerts(): WeatherAlert[] {
    // Return empty array for now - can add mock alerts if needed
    return [];
  }

  private getWeatherDescription(condition: string): string {
    const descriptions: { [key: string]: string } = {
      sunny: "晴れ",
      cloudy: "曇り",
      rainy: "雨",
      snowy: "雪",
      clear: "快晴",
      overcast: "曇天",
      drizzle: "小雨",
      thunderstorm: "雷雨",
      fog: "霧",
      windy: "強風",
    };
    return descriptions[condition] || "不明";
  }

  private getWeatherIcon(condition: string): string {
    const icons: { [key: string]: string } = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      snowy: "❄️",
      clear: "☀️",
      overcast: "☁️",
      drizzle: "🌦️",
      thunderstorm: "⛈️",
      fog: "🌫️",
      windy: "💨",
    };
    return icons[condition] || "❓";
  }
}
