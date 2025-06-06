import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ClothingItem, OutfitPost, WeatherCondition } from "../types";
import { Card, EmptyState } from "./Common";

export interface OutfitPostCardProps {
  post: OutfitPost;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
  onEdit?: (post: OutfitPost) => void;
  onDelete?: (postId: string) => void;
  currentUserId?: string;
  showActions?: boolean;
}

export const OutfitPostCard: React.FC<OutfitPostCardProps> = ({
  post,
  onLike,
  onUnlike,
  onEdit,
  onDelete,
  currentUserId,
  showActions = true,
}) => {
  const [liked, setLiked] = useState(false); // TODO: 実際のlike状態を取得
  const isOwner = currentUserId === post.userId;

  const handleLikeClick = () => {
    if (liked) {
      onUnlike?.(post.id);
      setLiked(false);
    } else {
      onLike?.(post.id);
      setLiked(true);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const iconMap: Record<string, string> = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      snowy: "❄️",
      thunderstorm: "⛈️",
      foggy: "🌫️",
      windy: "💨",
    };
    return iconMap[condition.toLowerCase()] || "🌤️";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "今日";
    }
    if (diffDays === 1) {
      return "昨日";
    }
    if (diffDays < 7) {
      return `${diffDays}日前`;
    }
    return date.toLocaleDateString("ja-JP");
  };

  return (
    <Card className="overflow-hidden">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {post.userId.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">ユーザー{post.userId}</p>
              <p className="text-sm text-gray-600">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {showActions && isOwner && (
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  onClick={() => onEdit(post)}
                  className="text-gray-500 hover:text-indigo-600"
                >
                  <svg
                    role="img"
                    aria-label="Edit"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Button>
              )}
              {onDelete && (
                <Button
                  onClick={() => onDelete(post.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <svg
                    role="img"
                    aria-label="Delete"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 天気情報 */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getWeatherIcon("sunny")}</span>
            <span className="font-semibold text-gray-900">
              {post.temperature}°C
            </span>
          </div>
          <div className="text-sm text-gray-600">天気を着る</div>
        </div>
      </div>

      {/* コーディネート画像エリア */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <svg
            role="img"
            aria-label="Outfit Image Placeholder"
            className="h-16 w-16 text-gray-400 mx-auto mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-sm">コーディネート画像</p>
        </div>
      </div>

      {/* 説明とタグ */}
      <div className="p-4">
        {post.description && (
          <p className="text-gray-900 mb-3">{post.description}</p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={crypto.randomUUID()}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <Button
            onClick={handleLikeClick}
            className={`flex items-center space-x-2 ${
              liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <svg
              role="img"
              aria-label="Like"
              className="h-5 w-5"
              fill={liked ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="text-sm font-medium">{post.likes}</span>
          </Button>

          <Button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600">
            <svg
              role="img"
              aria-label="Share"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.416L3 21l1.416-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
              />
            </svg>
            <span className="text-sm">コメント</span>
          </Button>

          <Button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600">
            <svg
              role="img"
              aria-label="Share"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            <span className="text-sm">シェア</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

// コーディネート投稿フォーム
export interface OutfitPostFormProps {
  weather?: WeatherCondition;
  selectedItems: ClothingItem[];
  onSubmit: (data: Omit<OutfitPost, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export const OutfitPostForm: React.FC<OutfitPostFormProps> = ({
  weather,
  selectedItems,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    tags: "",
    temperature: weather?.temperature || 20,
    isPublic: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    onSubmit({
      userId: "1", // TODO: 実際のユーザーIDを取得
      description: formData.description,
      tags,
      temperature: formData.temperature,
      likes: 0,
      clothingItems: selectedItems.map((item) => item.id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 選択したアイテムプレビュー */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          選択したアイテム
        </h3>
        {selectedItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 rounded-lg text-center"
              >
                <div className="text-2xl mb-1">👕</div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-600">{item.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            アイテムが選択されていません
          </p>
        )}
      </div>

      {/* 天気情報 */}
      {weather && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">天気</h3>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">☀️</span>
              <div>
                <p className="font-semibold">{weather.temperature}°C</p>
                <p className="text-sm text-gray-600 capitalize">
                  {weather.condition}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 気温調整 */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          気温: {formData.temperature}°C
        </Label>
        <input
          type="range"
          min="-10"
          max="40"
          value={formData.temperature}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              temperature: Number(e.target.value),
            }))
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-10°C</span>
          <span>40°C</span>
        </div>
      </div>

      {/* 説明 */}
      <div>
<Label>          コーディネートの説明
        </Label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="このコーディネートについて教えてください..."
        />
      </div>

      {/* タグ */}
      <div>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          タグ
        </Label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tags: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="カジュアル, オフィス, デート（カンマ区切り）"
        />
      </div>

      {/* 公開設定 */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))
          }
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <Label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
          この投稿を公開する
        </Label>
      </div>

      {/* ボタン */}
      <div className="flex space-x-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={selectedItems.length === 0}
        >
          投稿する
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  );
};

// コーディネートビルダー
export interface OutfitBuilderProps {
  items: ClothingItem[];
  weather?: WeatherCondition;
  onOutfitChange: (items: ClothingItem[]) => void;
}

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({
  items,
  weather,
  onOutfitChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");

  const categories = [
    { key: "tops", name: "トップス", icon: "👕" },
    { key: "bottoms", name: "ボトムス", icon: "👖" },
    { key: "shoes", name: "靴", icon: "👠" },
    { key: "outerwear", name: "アウター", icon: "🧥" },
    { key: "accessories", name: "アクセサリー", icon: "👜" },
  ];

  const getItemsByCategory = (category: string) => {
    return items.filter((item) => {
      switch (category) {
        case "tops":
          return ["tops", "shirts"].includes(item.category);
        case "bottoms":
          return ["bottoms", "pants", "skirts"].includes(item.category);
        case "shoes":
          return item.category === "shoes";
        case "outerwear":
          return ["outerwear", "jackets"].includes(item.category);
        case "accessories":
          return ["accessories", "hats", "bags"].includes(item.category);
        default:
          return false;
      }
    });
  };

  const handleItemSelect = (item: ClothingItem) => {
    const category = categories.find((cat) => {
      const categoryItems = getItemsByCategory(cat.key);
      return categoryItems.some((catItem) => catItem.id === item.id);
    });

    if (!category) return;

    const newItems = selectedItems.filter((selected) => {
      const selectedCategory = categories.find((cat) => {
        const categoryItems = getItemsByCategory(cat.key);
        return categoryItems.some((catItem) => catItem.id === selected.id);
      });
      return selectedCategory?.key !== category.key;
    });

    const updatedItems = [...newItems, item];
    setSelectedItems(updatedItems);
    onOutfitChange(updatedItems);
  };

  const handleItemRemove = (itemId: string) => {
    const newItems = selectedItems.filter((item) => item.id !== itemId);
    setSelectedItems(newItems);
    onOutfitChange(newItems);
  };

  const isItemSelected = (item: ClothingItem) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

  const getSelectedItemForCategory = (categoryKey: string) => {
    return selectedItems.find((item) => {
      const categoryItems = getItemsByCategory(categoryKey);
      return categoryItems.some((catItem) => catItem.id === item.id);
    });
  };

  return (
    <div className="space-y-6">
      {/* 現在のコーディネート */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          現在のコーディネート
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {categories.map((category) => {
            const selectedItem = getSelectedItemForCategory(category.key);
            return (
              <div key={category.key} className="text-center">
                <div className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-2 relative">
                  {selectedItem ? (
                    <>
                      <div className="text-center">
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <p className="text-xs font-medium text-gray-900">
                          {selectedItem.name}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleItemRemove(selectedItem.id)}
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl text-gray-400 mb-1">
                        {category.icon}
                      </div>
                      <p className="text-xs text-gray-500">{category.name}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* アイテム選択 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          アイテムを選択
        </h3>

        {/* カテゴリタブ */}
        <div className="flex space-x-1 mb-4 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                activeCategory === category.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Button>
          ))}
        </div>

        {/* アイテム一覧 */}
        {activeCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {getItemsByCategory(activeCategory).map((item) => (
              <Button
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isItemSelected(item)
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {categories.find((cat) => cat.key === activeCategory)?.icon}
                  </div>
                  <p className="font-medium text-gray-900 text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-600">{item.color}</p>
                  {item.warmthLevel && (
                    <div className="mt-1">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        保温性 {item.warmthLevel}/10
                      </span>
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        )}

        {activeCategory && getItemsByCategory(activeCategory).length === 0 && (
          <EmptyState
            title={`${
              categories.find((cat) => cat.key === activeCategory)?.name
            }がありません`}
            message="このカテゴリのアイテムを追加してください。"
            actionLabel="アイテムを追加"
            onAction={() => {
              /* TODO: アイテム追加画面を開く */
            }}
          />
        )}
      </Card>

      {/* 天気に基づく推奨 */}
      {weather && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            天気に基づく推奨
          </h3>
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-xl">☀️</span>
            <div>
              <p className="font-medium">{weather.temperature}°C</p>
              <p className="text-sm text-gray-600 capitalize">
                {weather.condition}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {weather.temperature > 25 && (
              <p className="text-blue-600">• 軽装がおすすめです</p>
            )}
            {weather.temperature < 15 && (
              <p className="text-orange-600">• 暖かいアウターをお忘れなく</p>
            )}
            {weather.condition.includes("rain") && (
              <p className="text-blue-600">• 雨具を用意しましょう</p>
            )}
            {weather.windSpeed > 5 && (
              <p className="text-green-600">
                • 風が強いため、風を通しにくい服装を
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
