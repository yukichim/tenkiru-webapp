import { useCallback, useState } from "react";
import { FashionModel } from "../models/FashionModel";
import type {
  FashionRecommendation,
  Location,
  RecommendationRequest,
} from "../types";
import { apiClient } from "../utils/api-client";
import { LocationUtils } from "../utils/helpers";
import {
  FashionRecommendationSchema,
  LocationSchema,
  RecommendationRequestSchema,
} from "../utils/schemas";

export interface FashionState {
  currentRecommendation: FashionRecommendation | null;
  userRecommendations: FashionRecommendation[];
  isLoading: boolean;
  error: string | null;
  currentLocation: Location | null;
}

export class FashionController {
  private setState: (state: Partial<FashionState>) => void;

  constructor(setState: (state: Partial<FashionState>) => void) {
    this.setState = setState;
  }

  public async getRecommendations(
    request: RecommendationRequest
  ): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      //const recommendation = await FashionModel.getRecommendations(request);
      const recommendation = {} as FashionRecommendation;
      this.setState({
        currentRecommendation: recommendation,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "おすすめの取得に失敗しました",
      });
      throw error;
    }
  }

  public async getRecommendationsForCurrentLocation(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // Get current location
      const position = await LocationUtils.getCurrentLocation();
      const { latitude, longitude } = position.coords;

      // Get location name
      const locationName = await LocationUtils.getLocationName(
        latitude,
        longitude
      );

      const currentLocation: Location = {
        lat: latitude,
        lon: longitude,
        name: locationName,
      };

      // Get recommendations
      const recommendation = await FashionModel.getRecommendationsForLocation(
        currentLocation
      );

      this.setState({
        currentRecommendation: recommendation,
        currentLocation,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "現在地のおすすめ取得に失敗しました",
      });
      throw error;
    }
  }

  public async getRecommendationsForLocation(
    location: Location | null
  ): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });
      if (!location) {
        return;
      }

      const recommendation = await FashionModel.getRecommendationsForLocation(
        location
      );

      this.setState({
        currentRecommendation: recommendation,
        currentLocation: location,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "指定地点のおすすめ取得に失敗しました",
      });
      throw error;
    }
  }

  public async getUserRecommendations(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const recommendations = await FashionModel.getUserRecommendations();

      this.setState({
        userRecommendations: recommendations,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "おすすめ履歴の取得に失敗しました",
      });
      throw error;
    }
  }

  public async refreshRecommendations(): Promise<void> {
    if (this.getCurrentLocation()) {
      await this.getRecommendationsForLocation(this.getCurrentLocation());
    } else {
      await this.getRecommendationsForCurrentLocation();
    }
  }

  public getCurrentLocation(): Location | null {
    return this.getState().currentLocation;
  }

  public getCurrentRecommendation(): FashionRecommendation | null {
    return this.getState().currentRecommendation;
  }

  private getState(): FashionState {
    // This is a simplified approach - in a real implementation,
    // you'd need a way to access the current state
    throw new Error(
      "getState method needs to be implemented with proper state management"
    );
  }

  public clearError(): void {
    this.setState({ error: null });
  }

  public clearRecommendations(): void {
    this.setState({
      currentRecommendation: null,
      userRecommendations: [],
      currentLocation: null,
    });
  }

  // Zodスキーマを使用した型安全なAPIメソッド
  public async getRecommendationsWithValidation(
    request: RecommendationRequest
  ): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // リクエストデータのバリデーション
      const validatedRequest = RecommendationRequestSchema.parse(request);

      // 型安全なAPIコール
      const recommendation = await apiClient.safePost(
        "/fashion/recommendations",
        validatedRequest,
        FashionRecommendationSchema
      );

      this.setState({
        currentRecommendation: recommendation,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "おすすめの取得に失敗しました",
      });
      throw error;
    }
  }

  public async getRecommendationsForLocationWithValidation(
    location: Location
  ): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // ロケーションデータのバリデーション
      const validatedLocation = LocationSchema.parse(location);

      // 型安全なAPIコール
      const recommendation = await apiClient.safeGet(
        `/fashion/recommendations/location?lat=${validatedLocation.lat}&lon=${
          validatedLocation.lon
        }&name=${encodeURIComponent(validatedLocation.name)}`,
        FashionRecommendationSchema
      );

      this.setState({
        currentRecommendation: recommendation,
        currentLocation: validatedLocation,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "指定地点のおすすめ取得に失敗しました",
      });
      throw error;
    }
  }
}

// Hook for using FashionController
export const useFashionController = () => {
  const [state, setState] = useState<FashionState>({
    currentRecommendation: null,
    userRecommendations: [],
    isLoading: false,
    error: null,
    currentLocation: null,
  });

  const updateState = useCallback((newState: Partial<FashionState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  const controller = new FashionController(updateState);

  const loadCurrentWeather = useCallback(
    async (location: string) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // 簡単な場所名から座標への変換（実際にはLocationUtilsまたはAPIを使用）
        const locationObj: Location = {
          lat: 35.6762, // 東京の座標をデフォルトとして使用
          lon: 139.6503,
          name: location,
        };

        await controller.getRecommendationsForLocation(locationObj);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "天気情報の取得に失敗しました",
        }));
      }
    },
    [controller]
  );

  const loadForecast = useCallback(async (location: string) => {
    // TODO: 天気予報の実装
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const getRecommendations = useCallback(
    async (location: Location) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        await controller.getRecommendationsForLocation(location);
      } catch (error) {
        console.error("Recommendation generation failed:", error);
      }
    },
    [controller]
  );

  const generateRecommendation = useCallback(
    async (weather: any, userId: string) => {},
    []
  );

  return {
    currentWeather: state.currentRecommendation?.weather || null,
    forecast: [], // TODO: 実際の予報データを返す
    loading: state.isLoading,
    isLoading: state.isLoading,
    error: state.error,
    recommendations: state.currentRecommendation,
    loadCurrentWeather,
    loadForecast,
    getRecommendations,
    currentRecommendation: state.currentRecommendation,
    userRecommendations: state.userRecommendations,
    controller,
    generateRecommendation,
  };
};
