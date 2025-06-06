import type {
  FashionRecommendation,
  Location,
  RecommendationRequest,
} from "../types";
import { apiClient } from "../utils/api-client";
import { LocationUtils } from "../utils/helpers";

export class FashionModel {
  private constructor() {}
  public static async getRecommendations(
    request: RecommendationRequest
  ): Promise<FashionRecommendation> {
    try {
      return await apiClient.post<FashionRecommendation>(
        "/recommendations",
        request as unknown as Record<string, unknown>
      );
    } catch (error) {
      console.error("Failed to get fashion recommendations:", error);
      throw error;
    }
  }

  public static async getRecommendationsLegacy(
    latitude: number,
    longitude: number,
    location: string
  ): Promise<FashionRecommendation> {
    try {
      const queryParams = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        location: location,
      });

      return await apiClient.get<FashionRecommendation>(
        `/fashion-recommendations?${queryParams.toString()}`,
        false // Optional auth for legacy endpoint
      );
    } catch (error) {
      console.error("Failed to get legacy fashion recommendations:", error);
      throw error;
    }
  }

  public static async getUserRecommendations(): Promise<
    FashionRecommendation[]
  > {
    try {
      return await apiClient.get<FashionRecommendation[]>(
        "/recommendations/user"
      );
    } catch (error) {
      console.error("Failed to get user recommendations:", error);
      throw error;
    }
  }

  public static async getRecommendationsForLocation(
    location: Location
  ): Promise<FashionRecommendation> {
    try {
      const request: RecommendationRequest = {
        latitude: location.lat,
        longitude: location.lon,
        location: location.name,
      };

      return await FashionModel.getRecommendations(request);
    } catch (error) {
      console.error("Failed to get recommendations for location:", error);
      throw error;
    }
  }

  public static async getRecommendationsForCurrentLocation(): Promise<FashionRecommendation> {
    try {
      // Get current location
      const position = await LocationUtils.getCurrentLocation();
      const { latitude, longitude } = position.coords;

      // Get location name
      const locationName = await LocationUtils.getLocationName(
        latitude,
        longitude
      );

      // Get recommendations
      return await FashionModel.getRecommendationsForLocation({
        lat: latitude,
        lon: longitude,
        name: locationName,
      });
    } catch (error) {
      console.error(
        "Failed to get recommendations for current location:",
        error
      );
      throw error;
    }
  }

  // Helper methods for fashion styles
  public static getFashionStyles(): Array<{ value: string; label: string }> {
    return [
      { value: "casual", label: "カジュアル" },
      { value: "formal", label: "フォーマル" },
      { value: "sporty", label: "スポーティー" },
      { value: "warm", label: "防寒重視" },
      { value: "cool", label: "涼しさ重視" },
    ];
  }

  public static getColorPreferences(): string[] {
    return [
      "ブラック",
      "ホワイト",
      "グレー",
      "ネイビー",
      "ブラウン",
      "ベージュ",
      "レッド",
      "ブルー",
      "グリーン",
      "イエロー",
      "ピンク",
      "パープル",
    ];
  }

  public static getTemperatureRanges(): Array<{
    min: number;
    max: number;
    label: string;
  }> {
    return [
      { min: -999, max: 0, label: "極寒（0°C以下）" },
      { min: 0, max: 10, label: "寒い（0-10°C）" },
      { min: 10, max: 20, label: "涼しい（10-20°C）" },
      { min: 20, max: 25, label: "快適（20-25°C）" },
      { min: 25, max: 999, label: "暑い（25°C以上）" },
    ];
  }
}
