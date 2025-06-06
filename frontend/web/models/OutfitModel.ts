import type { CreateOutfitPostRequest, OutfitPost } from "../types";
import { apiClient } from "../utils/api-client";

export class OutfitModel {
  private constructor() {}
  public static async getAllOutfitPosts(): Promise<OutfitPost[]> {
    try {
      return await apiClient.get<OutfitPost[]>("/outfit-posts", false);
    } catch (error) {
      console.error("Failed to get outfit posts:", error);
      throw error;
    }
  }

  public static async getUserOutfitPosts(): Promise<OutfitPost[]> {
    try {
      return await apiClient.get<OutfitPost[]>("/outfit-posts/user");
    } catch (error) {
      console.error("Failed to get user outfit posts:", error);
      throw error;
    }
  }

  public static async getOutfitPost(id: string): Promise<OutfitPost> {
    try {
      return await apiClient.get<OutfitPost>(`/outfit-posts/${id}`, false);
    } catch (error) {
      console.error("Failed to get outfit post:", error);
      throw error;
    }
  }

  public static async createOutfitPost(
    outfitData: CreateOutfitPostRequest
  ): Promise<OutfitPost> {
    try {
      return await apiClient.post<OutfitPost>(
        "/outfit-posts/create",
        outfitData as unknown as Record<string, unknown>
      );
    } catch (error) {
      console.error("Failed to create outfit post:", error);
      throw error;
    }
  }

  public static async likeOutfitPost(id: string): Promise<OutfitPost> {
    try {
      return await apiClient.post<OutfitPost>(
        `/outfit-posts/${id}/like`,
        {} as Record<string, unknown>
      );
    } catch (error) {
      console.error("Failed to like outfit post:", error);
      throw error;
    }
  }

  public static async deleteOutfitPost(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/outfit-posts/${id}`);
    } catch (error) {
      console.error("Failed to delete outfit post:", error);
      throw error;
    }
  }

  public static async updateOutfitPost(
    id: string,
    updates: Partial<OutfitPost>
  ): Promise<OutfitPost> {
    try {
      return await apiClient.put<OutfitPost>(`/outfit-posts/${id}`, updates);
    } catch (error) {
      console.error("Failed to update outfit post:", error);
      throw error;
    }
  }

  public static async unlikeOutfitPost(id: string): Promise<OutfitPost> {
    try {
      return await apiClient.delete<OutfitPost>(`/outfit-posts/${id}/like`);
    } catch (error) {
      console.error("Failed to unlike outfit post:", error);
      throw error;
    }
  }

  public static async getUserOutfitPostsById(
    userId: string
  ): Promise<OutfitPost[]> {
    try {
      return await apiClient.get<OutfitPost[]>(
        `/outfit-posts/user/${userId}`,
        false
      );
    } catch (error) {
      console.error("Failed to get user outfit posts by ID:", error);
      throw error;
    }
  }

  // Helper methods for outfit creation
  public static getPopularTags(): string[] {
    return [
      "今日のコーデ",
      "プチプラ",
      "オフィス",
      "デート",
      "お出かけ",
      "カジュアル",
      "きれいめ",
      "寒さ対策",
      "雨の日",
      "春コーデ",
      "夏コーデ",
      "秋コーデ",
      "冬コーデ",
      "モノトーン",
      "カラフル",
      "シンプル",
    ];
  }

  public static validateOutfitPost(outfit: CreateOutfitPostRequest): string[] {
    const errors: string[] = [];

    if (!outfit.items || outfit.items.length === 0) {
      errors.push("少なくとも1つのアイテムが必要です");
    }

    if (!outfit.description || outfit.description.trim().length === 0) {
      errors.push("コーディネートの説明が必要です");
    }

    if (outfit.description && outfit.description.length > 500) {
      errors.push("説明は500文字以内で入力してください");
    }

    if (!outfit.location || outfit.location.trim().length === 0) {
      errors.push("場所の情報が必要です");
    }

    return errors;
  }

  public static formatOutfitForDisplay(outfit: OutfitPost): {
    formattedDate: string;
    weatherSummary: string;
    itemCount: number;
  } {
    const formattedDate = new Date(outfit.createdAt).toLocaleDateString(
      "ja-JP",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );

    const weatherSummary = `${Math.round(outfit.temperature)}°C、${
      outfit.weather.condition
    }`;
    const itemCount = outfit.items.length;

    return {
      formattedDate,
      weatherSummary,
      itemCount,
    };
  }
}
