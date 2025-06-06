"use client";

import {
  ExternalLink,
  Heart,
  Shirt,
  ShirtIcon,
  Shuffle,
  Sun,
  Umbrella,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface FashionItem {
  category: string;
  name: string;
  color: string;
  reason: string;
}

interface FashionRecommendation {
  style: string;
  items: FashionItem[];
  weather: string;
  temp: number;
}

interface OutfitPost {
  id: string;
  userId: string;
  userName: string;
  items: string[];
  weather: string;
  temperature: number;
  location: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
}

interface FashionRecommendationProps {
  weather?: string;
  minTemp?: string;
  maxTemp?: string;
  user?: {
    gender?: string;
    age?: number;
    preferences?: {
      style: string[];
      colors: string[];
    };
  };
}

/**
 * おススメの服装を表示するコンポーネント
 * @param param0
 * @returns
 */
export default function FashionRecommendation({
  weather,
  minTemp,
  maxTemp,
  user,
}: FashionRecommendationProps) {
  const [selectedStyle, setSelectedStyle] = useState<
    "casual" | "formal" | "sporty"
  >("casual");
  const [recommendations, setRecommendations] =
    useState<FashionRecommendation | null>(null);
  const [outfitPosts, setOutfitPosts] = useState<OutfitPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const temp = maxTemp ? Number.parseInt(maxTemp) : 20;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (weather && temp) {
      fetchRecommendations();
      fetchOutfitPosts();
    }
  }, [weather, temp, selectedStyle]);

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const params = new URLSearchParams({
        weather: weather || "晴れ",
        temp: temp.toString(),
        style: selectedStyle,
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
        }/api/recommendations?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      // フォールバック: ローカルレコメンデーション
      setRecommendations(getLocalRecommendations());
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const fetchOutfitPosts = async () => {
    setLoadingPosts(true);
    try {
      const params = new URLSearchParams({
        weather: weather || "晴れ",
        temp: temp.toString(),
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
        }/api/posts?${params}`
      );

      if (response.ok) {
        const data = await response.json();
        setOutfitPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch outfit posts:", error);
      // フォールバック: モックデータ
      setOutfitPosts(getMockOutfitPosts());
    } finally {
      setLoadingPosts(false);
    }
  };

  const getLocalRecommendations = (): FashionRecommendation => {
    const items: FashionItem[] = [];
    const isRainy = weather?.includes("雨") || false;
    const isCold = temp < 15;
    const isHot = temp > 25;

    if (isCold) {
      items.push({
        category: "アウター",
        name: "厚手のコート",
        color: "ダークカラー",
        reason: "防寒対策",
      });
      items.push({
        category: "トップス",
        name: "セーター",
        color: "ウォームカラー",
        reason: "保温性",
      });
    } else if (isHot) {
      items.push({
        category: "トップス",
        name: "半袖Tシャツ",
        color: "ライトカラー",
        reason: "涼しさ重視",
      });
      items.push({
        category: "ボトムス",
        name: "ショートパンツ",
        color: "明るい色",
        reason: "通気性",
      });
    } else {
      items.push({
        category: "トップス",
        name: "長袖Tシャツ",
        color: "明るめの色",
        reason: "快適な温度調節",
      });
      items.push({
        category: "ボトムス",
        name: "チノパンツ",
        color: "ベージュやカーキ",
        reason: "動きやすさ",
      });
    }

    if (isRainy) {
      items.push({
        category: "アクセサリー",
        name: "レインウェア",
        color: "機能重視",
        reason: "雨対策",
      });
    }

    return {
      style: selectedStyle,
      items,
      weather: weather || "晴れ",
      temp,
    };
  };

  const getMockOutfitPosts = (): OutfitPost[] => {
    return [
      {
        id: "1",
        userId: "user1",
        userName: "田中さん",
        items: ["セーター", "ジーンズ", "スニーカー"],
        weather: weather || "晴れ",
        temperature: temp,
        location: "東京",
        createdAt: new Date().toISOString(),
        likes: 42,
      },
      {
        id: "2",
        userId: "user2",
        userName: "佐藤さん",
        items: ["Tシャツ", "ショートパンツ", "サンダル"],
        weather: weather || "晴れ",
        temperature: temp,
        location: "大阪",
        createdAt: new Date().toISOString(),
        likes: 38,
      },
    ];
  };

  const getItemIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "アウター":
      case "outerwear":
        return ShirtIcon;
      case "アクセサリー":
      case "accessories":
        return Umbrella;
      default:
        return Shirt;
    }
  };

  const getItemColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "アウター":
      case "outerwear":
        return "text-blue-500";
      case "アクセサリー":
      case "accessories":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };
  if (!weather || !temp) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <Shirt className="mx-auto h-12 w-12 mb-4" />
          <p>天気情報を取得してファッション提案を表示します</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ファッション提案 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Shirt className="w-6 h-6 mr-2" />
          ファッション提案
        </h2>

        {/* スタイル選択 */}
        <div className="flex space-x-2 mb-6">
          {(["casual", "formal", "sporty"] as const).map((style) => (
            <Button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStyle === style
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {style === "casual" && "カジュアル"}
              {style === "formal" && "フォーマル"}
              {style === "sporty" && "スポーティ"}
            </Button>
          ))}
        </div>

        {/* レコメンデーション表示 */}
        {loadingRecommendations ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : recommendations ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.items.map((item, index) => {
              const IconComponent = getItemIcon(item.category);
              const iconColor = getItemColor(item.category);

              return (
                <div
                  key={crypto.randomUUID()}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent
                      className={`w-6 h-6 ${iconColor} flex-shrink-0 mt-1`}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.category}
                      </h3>
                      <p className="text-lg text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.color}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* 天気アドバイス */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <div className="flex items-center space-x-2 mb-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-gray-800">今日のアドバイス</span>
          </div>
          <p className="text-sm text-gray-700">
            {weather?.includes("晴") &&
              "紫外線対策を忘れずに。帽子やサングラスもおすすめです。"}
            {weather?.includes("雨") &&
              "雨の日は、足元に注意！防水性のある靴を選びましょう。"}
            {weather?.includes("曇") &&
              "気温の変化に注意。羽織れるものを一枚持っていると安心です。"}
            {weather?.includes("雪") &&
              "雪道は滑りやすいです。滑り止めのある靴を履きましょう。"}
          </p>
        </div>
      </div>

      {/* みんなのコーデ */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <Shuffle className="w-5 h-5 mr-2" />
          みんなのコーデ
        </h3>

        {loadingPosts ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outfitPosts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {post.userName}
                    </h4>
                    <p className="text-sm text-gray-500">{post.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {post.temperature}°C
                    </p>
                    <p className="text-xs text-gray-500">{post.weather}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.items.map((item, index) => (
                      <span
                        key={crypto.randomUUID()}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-700">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </Button>
                  <Button className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800">
                    <ExternalLink className="w-3 h-3" />
                    <span>詳細を見る</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
