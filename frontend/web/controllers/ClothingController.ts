import { useCallback, useState } from "react";
import { ClothingModel } from "../models/ClothingModel";
import type { ClothingCategory, ClothingItem } from "../types";
import {
  ClothingItemSchema,
  CreateClothingRequestSchema
} from "../utils/schemas";
import { apiClient } from "../utils/api-client";

export interface ClothingControllerState {
  items: ClothingItem[];
  clothingItems: ClothingItem[]; // ProfilePageで期待されるプロパティ名
  categories: ClothingCategory[];
  loading: boolean;
  isLoading: boolean; // ProfilePageで期待されるプロパティ名
  error: string | null;
  selectedItem: ClothingItem | null;
}

export interface ClothingControllerActions {
  loadItems: () => Promise<void>;
  loadCategories: () => Promise<void>;
  getUserClothing: (userId: string) => Promise<void>; // ProfilePageで期待されるメソッド
  getClothingStats: () => { total: number; byCategory: Record<string, number> }; // ProfilePageで期待されるメソッド
  addItem: (
    item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateItem: (id: string, updates: Partial<ClothingItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  selectItem: (item: ClothingItem | null) => void;
  clearError: () => void;
  // 型安全なメソッド
  loadItemsWithValidation: () => Promise<void>;
  addItemWithValidation: (
    item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateItemWithValidation: (id: string, updates: Partial<ClothingItem>) => Promise<void>;
}

export const useClothingController = (): ClothingControllerState &
  ClothingControllerActions => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [categories, setCategories] = useState<ClothingCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  const handleError = useCallback((error: unknown, operation: string) => {
    console.error(`${operation} error:`, error);
    const errorMessage =
      error instanceof Error ? error.message : `${operation}に失敗しました`;
    setError(errorMessage);
    setLoading(false);
  }, []);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ClothingModel.getItems();
      setItems(data);
    } catch (error) {
      handleError(error, "アイテム読み込み");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = ClothingModel.getClothingCategories();
      setCategories(data);
    } catch (error) {
      handleError(error, "カテゴリ読み込み");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getUserClothing = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await ClothingModel.getUserItems(userId);
        setItems(data);
      } catch (error) {
        handleError(error, "ユーザーアイテム読み込み");
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const addItem = useCallback(
    async (item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">) => {
      try {
        setLoading(true);
        setError(null);
        const newItem = await ClothingModel.addItem(item);
        setItems((prev) => [...prev, newItem]);
      } catch (error) {
        handleError(error, "アイテム追加");
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<ClothingItem>) => {
      try {
        setLoading(true);
        setError(null);
        const updatedItem = await ClothingModel.updateItem(id, updates);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        );
        if (selectedItem?.id === id) {
          setSelectedItem(updatedItem);
        }
      } catch (error) {
        handleError(error, "アイテム更新");
      } finally {
        setLoading(false);
      }
    },
    [handleError, selectedItem]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await ClothingModel.deleteItem(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        if (selectedItem?.id === id) {
          setSelectedItem(null);
        }
      } catch (error) {
        handleError(error, "アイテム削除");
      } finally {
        setLoading(false);
      }
    },
    [handleError, selectedItem]
  );

  const selectItem = useCallback((item: ClothingItem | null) => {
    setSelectedItem(item);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getClothingStats = useCallback(() => {
    const total = items.length;
    const byCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, byCategory };
  }, [items]);

  // Zodスキーマを使用した型安全なAPIメソッド
  const loadItemsWithValidation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 型安全なAPIコール
      const data = await apiClient.safeGet(
        "/clothing/items",
        ClothingItemSchema.array()
      );
      
      setItems(data);
    } catch (error) {
      handleError(error, "アイテム読み込み");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const addItemWithValidation = useCallback(async (
    item: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setLoading(true);
      setError(null);

      // リクエストデータのバリデーション（一部フィールドのみ）
      const validatedItem = CreateClothingRequestSchema.parse({
        name: item.name,
        category: item.category,
        color: item.color,
        brand: item.brand,
        imageUrl: item.imageUrl,
        warmthLevel: item.warmthLevel
      });

      // 型安全なAPIコール
      const newItem = await apiClient.safePost(
        "/clothing/items",
        { ...validatedItem, ...item },
        ClothingItemSchema
      );

      setItems(prev => [...prev, newItem]);
    } catch (error) {
      handleError(error, "アイテム追加");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateItemWithValidation = useCallback(async (
    id: string, 
    updates: Partial<ClothingItem>
  ) => {
    try {
      setLoading(true);
      setError(null);

      // 型安全なAPIコール
      const updatedItem = await apiClient.safePut(
        `/clothing/items/${id}`,
        updates,
        ClothingItemSchema
      );

      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
    } catch (error) {
      handleError(error, "アイテム更新");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    items,
    clothingItems: items, // ProfilePageで期待されるプロパティ名
    categories,
    loading,
    isLoading: loading, // ProfilePageで期待されるプロパティ名
    error,
    selectedItem,
    loadItems,
    loadCategories,
    getUserClothing,
    getClothingStats,
    addItem,
    updateItem,
    deleteItem,
    selectItem,
    clearError,
    // 型安全なメソッド
    loadItemsWithValidation,
    addItemWithValidation,
    updateItemWithValidation,
  };
};

// アイテムフィルタリング用のヘルパー関数
export const useClothingFilters = (items: ClothingItem[]) => {
  const [filters, setFilters] = useState({
    category: "",
    size: "",
    color: "",
    season: "",
    searchText: "",
  });

  const filteredItems = items.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.size && item.size !== filters.size) return false;
    if (filters.color && item.color !== filters.color) return false;
    if (filters.season && !item.season.includes(filters.season)) return false;
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      size: "",
      color: "",
      season: "",
      searchText: "",
    });
  };

  return {
    filters,
    filteredItems,
    updateFilter,
    clearFilters,
  };
};

/**
 * アイテム統計用ヘルパー関数
 * @param items
 * @returns
 */
export const useClothingStats = (items: ClothingItem[]) => {
  const getStats = () => {
    const total = items.length;
    const byCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySeason = items.reduce((acc, item) => {
      for (const i of item.season) {
        acc[i] = (acc[i] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const byColor = items.reduce((acc, item) => {
      acc[item.color] = (acc[item.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byCategory,
      bySeason,
      byColor,
    };
  };

  return getStats();
};
