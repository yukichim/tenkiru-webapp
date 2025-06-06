import type {
  ClothingCategory,
  ClothingItem,
  CreateClothingRequest,
} from "../types";
import { apiClient } from "../utils/api-client";

export class ClothingModel {
  private constructor() {}
  public static async addItem(
    item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ): Promise<ClothingItem> {
    try {
      return await apiClient.post<ClothingItem>("/clothing", item as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Failed to add clothing item:", error);
      throw error;
    }
  }

  public static async getItems(): Promise<ClothingItem[]> {
    try {
      return await apiClient.get<ClothingItem[]>("/clothing/");
    } catch (error) {
      console.error("Failed to get clothing items:", error);
      throw error;
    }
  }

  public static async getUserClothing(): Promise<ClothingItem[]> {
    try {
      return await apiClient.get<ClothingItem[]>("/clothing/");
    } catch (error) {
      console.error("Failed to get user clothing:", error);
      throw error;
    }
  }

  public static async getUserItems(userId: string): Promise<ClothingItem[]> {
    try {
      return await apiClient.get<ClothingItem[]>(
        `/clothing/user/${userId}`,
        false
      );
    } catch (error) {
      console.error("Failed to get user items:", error);
      throw error;
    }
  }

  public static async getClothingItem(id: string): Promise<ClothingItem> {
    try {
      return await apiClient.get<ClothingItem>(`/clothing/${id}`);
    } catch (error) {
      console.error("Failed to get clothing item:", error);
      throw error;
    }
  }

  public static async createClothingItem(
    clothingData: CreateClothingRequest
  ): Promise<ClothingItem> {
    try {
      return await apiClient.post<ClothingItem>("/clothing", clothingData as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Failed to create clothing item:", error);
      throw error;
    }
  }

  public static async updateClothingItem(
    id: string,
    clothingData: CreateClothingRequest
  ): Promise<ClothingItem> {
    try {
      return await apiClient.put<ClothingItem>(`/clothing/${id}`, clothingData as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Failed to update clothing item:", error);
      throw error;
    }
  }

  public static async deleteClothingItem(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/clothing/${id}`);
    } catch (error) {
      console.error("Failed to delete clothing item:", error);
      throw error;
    }
  }

  // Helper methods for clothing categories
  public static getClothingCategories(): ClothingCategory[] {
    const contents = [
      "トップス",
      "ボトムス",
      "アウター",
      "シューズ",
      "アクセサリー",
      "冬服",
      "防寒具",
      "秋冬服",
      "ジャケット",
      "春秋服",
      "カーディガン",
      "春夏服",
      "夏服",
      "Tシャツ",
      "レインコート",
      "長靴",
      "スノーブーツ",
      "手袋",
      "サングラス",
      "帽子",
      "ウインドブレーカー",
    ];
    const ret: ClothingCategory[] = contents.map((e, idx) => {
      return {
        id: String(idx),
        name: e,
      };
    });
    return ret;
  }

  public static getWarmthLevels(): Array<{ value: number; label: string }> {
    return [
      { value: 1, label: "非常に涼しい" },
      { value: 2, label: "涼しい" },
      { value: 3, label: "普通" },
      { value: 4, label: "暖かい" },
      { value: 5, label: "非常に暖かい" },
    ];
  }

  public static getBrandSuggestions(): string[] {
    return [
      "ユニクロ",
      "GU",
      "ZARA",
      "H&M",
      "無印良品",
      "ナイキ",
      "アディダス",
      "自作・ハンドメイド",
      "その他",
    ];
  }

  public static async updateItem(
    id: string,
    updates: Partial<ClothingItem>
  ): Promise<ClothingItem> {
    try {
      return await apiClient.put<ClothingItem>(`/clothing/${id}`, updates as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Failed to update clothing item:", error);
      throw error;
    }
  }

  public static async deleteItem(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/clothing/${id}`);
    } catch (error) {
      console.error("Failed to delete clothing item:", error);
      throw error;
    }
  }
}
