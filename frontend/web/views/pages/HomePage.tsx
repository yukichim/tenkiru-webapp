"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { useAuthController } from "../../controllers/AuthController";
import { useFashionController } from "../../controllers/FashionController";
import { ErrorDisplay, Layout, Loading } from "../Common";
import {
  WeatherCard,
  WeatherClothingAdvice,
  WeatherForecast,
} from "../WeatherComponents";

/**
 * ホームコンポーネント
 * @returns
 */
const HomePage: React.FC = () => {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    loadCurrentWeather,
    loadForecast,
    generateRecommendation,
  } = useFashionController();
  const { user } = useAuthController();
  const [location, setLocation] = useState("東京都");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    loadCurrentWeather(location);
    loadForecast(location);
  }, []);

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleGetRecommendation = async () => {
    if (currentWeather) {
      await generateRecommendation(currentWeather, user?.id || "1");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading message="天気情報を読み込み中..." />
      </Layout>
    );
  }

  return (
    <Layout title="TENKIRU - ホーム">
      <div className="space-y-8">
        {/* ヘッダーセクション */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            今日の天気に合った服装を見つけよう
          </h1>
          <p className="text-xl text-gray-600">
            天気予報とあなたのクローゼットから、最適なコーディネートを提案します
          </p>
        </div>

        {/* 位置選択 */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-4">
            <label
              htmlFor="location-select"
              className="text-sm font-medium text-gray-700"
            >
              場所:
            </label>
            <select
              id="location-select"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="東京都">東京都</option>
              <option value="大阪府">大阪府</option>
              <option value="愛知県">愛知県</option>
              <option value="福岡県">福岡県</option>
              <option value="北海道">北海道</option>
            </select>
          </div>
        </div>

        {error && (
          <ErrorDisplay
            error={error}
            onRetry={() => {
              loadCurrentWeather(location);
              loadForecast(location);
            }}
          />
        )}

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 現在の天気 */}
          <div className="lg:col-span-1">
            {currentWeather && (
              <WeatherCard
                weather={currentWeather}
                location={location}
                showDetails={true}
              />
            )}
          </div>

          {/* 服装アドバイス */}
          <div className="lg:col-span-2">
            {currentWeather && (
              <WeatherClothingAdvice weather={currentWeather} />
            )}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleGetRecommendation}
            disabled={!currentWeather}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            おすすめコーディネートを見る
          </Button>
          <Link
            href="/closet"
            className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
          >
            クローゼットを見る
          </Link>
        </div>

        {/* 天気予報 */}
        {forecast && forecast.length > 0 && (
          <WeatherForecast forecasts={forecast} />
        )}

        {/* 最近の投稿プレビュー */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              みんなのコーディネート
            </h2>
            <Link
              href="/posts"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* TODO: 最近の投稿を表示 */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">投稿1</span>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">投稿2</span>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">投稿3</span>
            </div>
          </div>
        </div>

        {/* クイックアクセス */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/weather"
            className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
          >
            <div className="text-2xl mb-2">🌤️</div>
            <div className="font-medium text-gray-900">詳細天気</div>
          </Link>
          <Link
            href="/closet"
            className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
          >
            <div className="text-2xl mb-2">👗</div>
            <div className="font-medium text-gray-900">クローゼット</div>
          </Link>
          <Link
            href="/outfit"
            className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
          >
            <div className="text-2xl mb-2">✨</div>
            <div className="font-medium text-gray-900">コーディネート</div>
          </Link>
          <Link
            href="/posts"
            className="p-4 bg-pink-50 rounded-lg text-center hover:bg-pink-100 transition-colors"
          >
            <div className="text-2xl mb-2">📸</div>
            <div className="font-medium text-gray-900">投稿</div>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
