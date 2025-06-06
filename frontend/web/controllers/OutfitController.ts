import { useCallback, useState } from "react";
import { OutfitModel } from "../models/OutfitModel";
import type { ClothingItem, OutfitPost } from "../types";

export interface OutfitControllerState {
  posts: OutfitPost[];
  userPosts: OutfitPost[];
  outfitPosts: OutfitPost[]; // ProfilePageで期待されるプロパティ名
  loading: boolean;
  isLoading: boolean; // ProfilePageで期待されるプロパティ名
  error: string | null;
  selectedPost: OutfitPost | null;
  currentOutfit: ClothingItem[];
  filters: {
    weather?: string;
    season?: string;
    temperature?: string;
    tags?: string;
    searchText?: string;
    sortBy?: "newest" | "oldest" | "likes";
  };
}

export interface OutfitControllerActions {
  loadPosts: () => Promise<void>;
  loadUserPosts: (userId: string) => Promise<void>;
  getUserPosts: (userId: string) => Promise<void>; // ProfilePageで期待されるメソッド（loadUserPostsのエイリアス）
  createPost: (
    post: Omit<OutfitPost, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  createOutfitPost: (
    post: Omit<OutfitPost, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  updatePost: (id: string, updates: Partial<OutfitPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  selectPost: (post: OutfitPost | null) => void;
  addToCurrentOutfit: (item: ClothingItem) => void;
  addToOutfit: (item: ClothingItem) => void;
  removeFromCurrentOutfit: (itemId: string) => void;
  removeFromOutfit: (itemId: string) => void;
  clearCurrentOutfit: () => void;
  clearOutfit: () => void;
  clearError: () => void;
  refreshPosts: () => Promise<void>;
  updateFilters: (
    newFilters: Partial<OutfitControllerState["filters"]>
  ) => void;
}

export const useOutfitController = (): OutfitControllerState &
  OutfitControllerActions => {
  const [posts, setPosts] = useState<OutfitPost[]>([]);
  const [userPosts, setUserPosts] = useState<OutfitPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<OutfitPost | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<ClothingItem[]>([]);
  const [filters, setFilters] = useState<OutfitControllerState["filters"]>({});

  /**
   * エラーハンドリング
   */
  const handleError = useCallback((error: unknown, operation: string) => {
    console.error(`${operation} error:`, error);
    const errorMessage =
      error instanceof Error ? error.message : `${operation}に失敗しました`;
    setError(errorMessage);
    setLoading(false);
  }, []);

  /**
   * 投稿の読み取り
   */
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await OutfitModel.getAllOutfitPosts();
      setPosts(data);
    } catch (error) {
      handleError(error, "投稿読み込み");
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const loadUserPosts = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await OutfitModel.getUserOutfitPostsById(userId);
        setUserPosts(data);
      } catch (error) {
        handleError(error, "ユーザー投稿読み込み");
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const createPost = useCallback(
    async (post: Omit<OutfitPost, "id" | "createdAt" | "updatedAt">) => {
      try {
        setLoading(true);
        setError(null);
        const newPost = await OutfitModel.createOutfitPost(post);
        setPosts((prev) => [newPost, ...prev]);
        setUserPosts((prev) => [newPost, ...prev]);
      } catch (error) {
        handleError(error, "投稿作成");
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const updatePost = useCallback(
    async (id: string, updates: Partial<OutfitPost>) => {
      try {
        setLoading(true);
        setError(null);
        const updatedPost = await OutfitModel.updateOutfitPost(id, updates);
        setPosts((prev) =>
          prev.map((post) => (post.id === id ? updatedPost : post))
        );
        setUserPosts((prev) =>
          prev.map((post) => (post.id === id ? updatedPost : post))
        );
        if (selectedPost?.id === id) {
          setSelectedPost(updatedPost);
        }
      } catch (error) {
        handleError(error, "投稿更新");
      } finally {
        setLoading(false);
      }
    },
    [handleError, selectedPost]
  );

  const deletePost = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await OutfitModel.deleteOutfitPost(id);
        setPosts((prev) => prev.filter((post) => post.id !== id));
        setUserPosts((prev) => prev.filter((post) => post.id !== id));
        if (selectedPost?.id === id) {
          setSelectedPost(null);
        }
      } catch (error) {
        handleError(error, "投稿削除");
      } finally {
        setLoading(false);
      }
    },
    [handleError, selectedPost]
  );

  const likePost = useCallback(
    async (postId: string) => {
      try {
        await OutfitModel.likeOutfitPost(postId);
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
        setUserPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      } catch (error) {
        handleError(error, "いいね");
      }
    },
    [handleError]
  );

  const unlikePost = useCallback(
    async (postId: string) => {
      try {
        await OutfitModel.unlikeOutfitPost(postId);
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likes: Math.max(0, post.likes - 1) }
              : post
          )
        );
        setUserPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, likes: Math.max(0, post.likes - 1) }
              : post
          )
        );
      } catch (error) {
        handleError(error, "いいね取り消し");
      }
    },
    [handleError]
  );

  const selectPost = useCallback((post: OutfitPost | null) => {
    setSelectedPost(post);
  }, []);

  const addToCurrentOutfit = useCallback((item: ClothingItem) => {
    setCurrentOutfit((prev) => {
      // 同じカテゴリのアイテムは置き換える
      const filtered = prev.filter(
        (existing) => existing.category !== item.category
      );
      return [...filtered, item];
    });
  }, []);

  const removeFromCurrentOutfit = useCallback((itemId: string) => {
    setCurrentOutfit((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCurrentOutfit = useCallback(() => {
    setCurrentOutfit([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const updateFilters = useCallback(
    (newFilters: Partial<OutfitControllerState["filters"]>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const refreshPosts = useCallback(async () => {
    await loadPosts();
  }, [loadPosts]);

  const createOutfitPost = useCallback(
    async (
      post: Omit<OutfitPost, "id" | "createdAt" | "updatedAt">
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        const newPost = await OutfitModel.createOutfitPost(post);
        setPosts((prev) => [newPost, ...prev]);
        setUserPosts((prev) => [newPost, ...prev]);
        return true;
      } catch (error) {
        handleError(error, "投稿作成");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const addToOutfit = useCallback(
    (item: ClothingItem) => {
      addToCurrentOutfit(item);
    },
    [addToCurrentOutfit]
  );

  const removeFromOutfit = useCallback(
    (itemId: string) => {
      removeFromCurrentOutfit(itemId);
    },
    [removeFromCurrentOutfit]
  );

  const clearOutfit = useCallback(() => {
    clearCurrentOutfit();
  }, [clearCurrentOutfit]);

  return {
    posts,
    userPosts,
    outfitPosts: userPosts, // ProfilePageで期待されるプロパティ名
    loading,
    isLoading: loading, // ProfilePageで期待されるプロパティ名
    error,
    selectedPost,
    currentOutfit,
    filters,
    loadPosts,
    loadUserPosts,
    getUserPosts: loadUserPosts, // ProfilePageで期待されるメソッド（loadUserPostsのエイリアス）
    createPost,
    createOutfitPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    selectPost,
    addToCurrentOutfit,
    addToOutfit,
    removeFromCurrentOutfit,
    removeFromOutfit,
    clearCurrentOutfit,
    clearOutfit,
    clearError,
    refreshPosts,
    updateFilters,
  };
};

// 投稿フィルタリング用のヘルパー関数
export const useOutfitFilters = (posts: OutfitPost[]) => {
  const [filters, setFilters] = useState({
    temperature: "",
    weather: "",
    tags: "",
    searchText: "",
    sortBy: "newest" as "newest" | "oldest" | "likes",
  });

  const filteredPosts = posts
    .filter((post) => {
      if (filters.temperature) {
        const temp = Number.parseFloat(filters.temperature);
        const postTemp = post.temperature;
        if (Math.abs(postTemp - temp) > 5) return false;
      }
      if (
        filters.weather &&
        !post.description?.toLowerCase().includes(filters.weather.toLowerCase())
      ) {
        return false;
      }
      if (filters.tags) {
        const filterTags = filters.tags
          .toLowerCase()
          .split(",")
          .map((tag) => tag.trim());
        const postTags = post.tags?.map((tag) => tag.toLowerCase()) || [];
        if (!filterTags.some((tag) => postTags.includes(tag))) return false;
      }
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          post.description?.toLowerCase().includes(searchLower) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "likes":
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      temperature: "",
      weather: "",
      tags: "",
      searchText: "",
      sortBy: "newest",
    });
  };

  return {
    filters,
    filteredPosts,
    updateFilter,
    clearFilters,
  };
};

// 衣装組み合わせ用のヘルパー関数
export const useOutfitBuilder = () => {
  const [outfit, setOutfit] = useState<{
    top: ClothingItem | null;
    bottom: ClothingItem | null;
    shoes: ClothingItem | null;
    outerwear: ClothingItem | null;
    accessories: ClothingItem[];
  }>({
    top: null,
    bottom: null,
    shoes: null,
    outerwear: null,
    accessories: [],
  });

  const addToOutfit = (item: ClothingItem) => {
    switch (item.category) {
      case "tops":
      case "shirts":
        setOutfit((prev) => ({ ...prev, top: item }));
        break;
      case "bottoms":
      case "pants":
      case "skirts":
        setOutfit((prev) => ({ ...prev, bottom: item }));
        break;
      case "shoes":
        setOutfit((prev) => ({ ...prev, shoes: item }));
        break;
      case "outerwear":
      case "jackets":
        setOutfit((prev) => ({ ...prev, outerwear: item }));
        break;
      case "accessories":
        setOutfit((prev) => ({
          ...prev,
          accessories: [
            ...prev.accessories.filter((acc) => acc.id !== item.id),
            item,
          ],
        }));
        break;
    }
  };

  const removeFromOutfit = (category: string, itemId?: string) => {
    switch (category) {
      case "top":
        setOutfit((prev) => ({ ...prev, top: null }));
        break;
      case "bottom":
        setOutfit((prev) => ({ ...prev, bottom: null }));
        break;
      case "shoes":
        setOutfit((prev) => ({ ...prev, shoes: null }));
        break;
      case "outerwear":
        setOutfit((prev) => ({ ...prev, outerwear: null }));
        break;
      case "accessories":
        if (itemId) {
          setOutfit((prev) => ({
            ...prev,
            accessories: prev.accessories.filter((acc) => acc.id !== itemId),
          }));
        }
        break;
    }
  };

  const clearOutfit = () => {
    setOutfit({
      top: null,
      bottom: null,
      shoes: null,
      outerwear: null,
      accessories: [],
    });
  };

  const getOutfitItems = (): ClothingItem[] => {
    const items: ClothingItem[] = [];
    if (outfit.top) items.push(outfit.top);
    if (outfit.bottom) items.push(outfit.bottom);
    if (outfit.shoes) items.push(outfit.shoes);
    if (outfit.outerwear) items.push(outfit.outerwear);
    items.push(...outfit.accessories);
    return items;
  };

  const isComplete = () => {
    return outfit.top && outfit.bottom && outfit.shoes;
  };

  return {
    outfit,
    addToOutfit,
    removeFromOutfit,
    clearOutfit,
    getOutfitItems,
    isComplete,
  };
};
