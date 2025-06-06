import React, { useState } from "react";
import { Button } from "../components/ui/button";
import type { ClothingCategory, ClothingItem } from "../types";
import { Card, EmptyState } from "./Common";

export interface ClothingItemCardProps {
  item: ClothingItem;
  onEdit?: (item: ClothingItem) => void;
  onDelete?: (id: string) => void;
  onSelect?: (item: ClothingItem) => void;
  isSelected?: boolean;
  showActions?: boolean;
}

export const ClothingItemCard: React.FC<ClothingItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false,
  showActions = true,
}) => {
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      tops: "👕",
      shirts: "👔",
      bottoms: "👖",
      pants: "👖",
      skirts: "👗",
      dresses: "👗",
      shoes: "👠",
      outerwear: "🧥",
      jackets: "🧥",
      accessories: "👜",
      hats: "🎩",
      bags: "👜",
    };
    return iconMap[category.toLowerCase()] || "👕";
  };

  const getWarmthLevelColor = (level: number) => {
    if (level >= 8) return "bg-red-100 text-red-800";
    if (level >= 6) return "bg-orange-100 text-orange-800";
    if (level >= 4) return "bg-yellow-100 text-yellow-800";
    if (level >= 2) return "bg-blue-100 text-blue-800";
    return "bg-blue-200 text-blue-900";
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 ${
        isSelected ? "ring-2 ring-indigo-500 bg-indigo-50" : ""
      }`}
      onClick={() => onSelect?.(item)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(item.category)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            {item.brand && (
              <p className="text-sm text-gray-600">{item.brand}</p>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="text-gray-500 hover:text-indigo-600"
              >
                <svg
                  role="img"
                  aria-label="a"
                  className="h-4 w-4"
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
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="text-gray-500 hover:text-red-600"
              >
                <svg
                  role="img"
                  aria-label="b"
                  className="h-4 w-4"
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

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">色:</span>
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <span className="capitalize">{item.color}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">サイズ:</span>
          <span className="font-medium">{item.size}</span>
        </div>

        {item.warmthLevel && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">保温性:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getWarmthLevelColor(
                item.warmthLevel
              )}`}
            >
              {item.warmthLevel}/10
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">季節:</span>
          <div className="flex space-x-1">
            {item.season.map((s, index) => (
              <span
                key={crypto.randomUUID()}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {item.description && (
          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        )}
      </div>
    </Card>
  );
};

// 衣類フィルターコンポーネント
export interface ClothingFiltersProps {
  categories: ClothingCategory[];
  filters: {
    category: string;
    size: string;
    color: string;
    season: string;
    searchText: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export const ClothingFilters: React.FC<ClothingFiltersProps> = ({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const seasons = ["春", "夏", "秋", "冬"];
  const colors = [
    "黒",
    "白",
    "灰色",
    "赤",
    "青",
    "緑",
    "黄色",
    "紫",
    "ピンク",
    "茶色",
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          クリア
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 検索 */}
        <div>
          <label
            htmlFor="search-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            検索
          </label>
          <input
            id="search-input"
            type="text"
            value={filters.searchText}
            onChange={(e) => onFilterChange("searchText", e.target.value)}
            placeholder="アイテム名、ブランドで検索..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label
            htmlFor="category-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            カテゴリ
          </label>
          <select
            id="category-input"
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">全てのカテゴリ</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* サイズ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サイズ
          </label>
          <select
            value={filters.size}
            onChange={(e) => onFilterChange("size", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">全てのサイズ</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* 色 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            色
          </label>
          <select
            value={filters.color}
            onChange={(e) => onFilterChange("color", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">全ての色</option>
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* 季節 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            季節
          </label>
          <select
            value={filters.season}
            onChange={(e) => onFilterChange("season", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">全ての季節</option>
            {seasons.map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
};

// 衣類追加・編集フォーム
export interface ClothingFormProps {
  item?: ClothingItem;
  categories: ClothingCategory[];
  onSubmit: (
    data: Omit<ClothingItem, "id" | "createdAt" | "updatedAt">
  ) => void;
  onCancel: () => void;
}

export const ClothingForm: React.FC<ClothingFormProps> = ({
  item,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    category: item?.category || "",
    size: item?.size || "M",
    color: item?.color || "",
    season: item?.season || [],
    description: item?.description || "",
    brand: item?.brand || "",
    warmthLevel: item?.warmthLevel || 5,
  });

  const seasons = ["春", "夏", "秋", "冬"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleSeasonChange = (season: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      season: checked
        ? [...prev.season, season]
        : prev.season.filter((s) => s !== season),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      userId: "1", // TODO: 実際のユーザーIDを取得
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* アイテム名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          アイテム名 *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* カテゴリとサイズ */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            カテゴリ *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">選択してください</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サイズ
          </label>
          <select
            value={formData.size}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, size: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 色とブランド */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            色 *
          </label>
          <input
            type="text"
            required
            value={formData.color}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, color: e.target.value }))
            }
            placeholder="例: 黒、紺、赤など"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ブランド
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, brand: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 季節 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          適用季節 *
        </label>
        <div className="grid grid-cols-4 gap-2">
          {seasons.map((season) => (
            <label key={season} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.season.includes(season)}
                onChange={(e) => handleSeasonChange(season, e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{season}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 保温性 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          保温性: {formData.warmthLevel}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={formData.warmthLevel}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              warmthLevel: Number(e.target.value),
            }))
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>薄手</span>
          <span>厚手</span>
        </div>
      </div>

      {/* 説明 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          説明・メモ
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="購入日、素材、お手入れ方法など"
        />
      </div>

      {/* ボタン */}
      <div className="flex space-x-3">
        <Button type="submit" className="flex-1">
          {item ? "更新" : "追加"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  );
};

// クローゼット概要コンポーネント
export interface ClosetOverviewProps {
  items: ClothingItem[];
  categories: ClothingCategory[];
}

export const ClosetOverview: React.FC<ClosetOverviewProps> = ({
  items,
  categories,
}) => {
  const getStats = () => {
    const total = items.length;
    const byCategory = categories.map((category) => ({
      name: category.name,
      count: items.filter((item) => item.category === category.name).length,
    }));

    const bySeason = ["春", "夏", "秋", "冬"].map((season) => ({
      name: season,
      count: items.filter((item) => item.season.includes(season)).length,
    }));

    return { total, byCategory, bySeason };
  };

  const { total, byCategory, bySeason } = getStats();

  if (total === 0) {
    return (
      <EmptyState
        title="クローゼットが空です"
        message="衣類を追加して、あなたのデジタルクローゼットを始めましょう。"
        actionLabel="最初のアイテムを追加"
        onAction={() => {
          /* TODO: 新規追加画面を開く */
        }}
        icon={
          <svg
            role="img"
            area-label="empty"
            className="h-12 w-12"
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
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 総数と基本情報 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          クローゼット概要
        </h3>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-indigo-600">{total}</div>
          <div className="text-gray-600">総アイテム数</div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">最近追加</span>
            <span className="font-medium">
              {items.length > 0
                ? new Date(
                    Math.max(
                      ...items.map((item) => new Date(item.createdAt).getTime())
                    )
                  ).toLocaleDateString("ja-JP")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">カテゴリ数</span>
            <span className="font-medium">{categories.length}</span>
          </div>
        </div>
      </Card>

      {/* カテゴリ別統計 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリ別</h3>
        <div className="space-y-3">
          {byCategory.map((category) => (
            <div
              key={category.name}
              className="flex justify-between items-center"
            >
              <span className="text-gray-700">{category.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${
                        total > 0 ? (category.count / total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                  {category.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
