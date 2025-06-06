"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuthController } from "../../controllers/AuthController";
import { useClothingController } from "../../controllers/ClothingController";
import { useOutfitController } from "../../controllers/OutfitController";
import type { ClothingItem, OutfitPost, WeatherCondition } from "../../types";
import { ClothingItemCard } from "../ClothingComponents";
import { ErrorDisplay, Layout, LoadingSpinner, Modal } from "../Common";
import {
  OutfitBuilder,
  OutfitPostCard,
  OutfitPostForm,
} from "../OutfitComponents";

export const OutfitPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "builder">("posts");
  const [showPostForm, setShowPostForm] = useState(false);
  const [showOutfitBuilder, setShowOutfitBuilder] = useState(false);
  const [selectedWeather, setSelectedWeather] =
    useState<WeatherCondition | null>(null);

  const { user } = useAuthController();

  const {
    outfitPosts,
    isLoading: outfitLoading,
    error: outfitError,
    filters,
    updateFilters,
    createOutfitPost,
    likePost,
    unlikePost,
    refreshPosts,
    currentOutfit,
    addToOutfit,
    removeFromOutfit,
    clearOutfit,
  } = useOutfitController();

  const {
    clothingItems,
    isLoading: clothingLoading,
    getUserClothing,
  } = useClothingController();

  useEffect(() => {
    refreshPosts();
    if (user) {
      getUserClothing(user.id);
    }
  }, [refreshPosts, getUserClothing, user]);

  const handleCreatePost = async (postData: Partial<OutfitPost>) => {
    if (!user) return;

    const success = await createOutfitPost({
      title: postData.title || "無題のコーディネート",
      description: postData.description || "",
      items: postData.items || [],
      tags: postData.tags || [],
      weather: postData.weather ?? ({} as WeatherCondition),
      temperature: postData.temperature || 20,
      location: postData.location || "不明",
      imageUrl: postData.imageUrl || "",
      likes: 0,
      userName: user.name,
      userId: user.id,
    });

    if (success) {
      setShowPostForm(false);
      refreshPosts();
    }
  };

  const handleLike = async (postId: string) => {
    await likePost(postId);
    refreshPosts();
  };

  const handleUnlike = async (postId: string) => {
    await unlikePost(postId);
    refreshPosts();
  };

  const handleWeatherFilter = (weather: WeatherCondition) => {
    setSelectedWeather(weather);
    updateFilters({ weather: weather.condition });
  };

  const isLoading = outfitLoading || clothingLoading;
  const error = outfitError;

  return (
    <Layout>
      <div className="outfit-page">
        <div className="outfit-page__header">
          <h1 className="outfit-page__title">コーディネート</h1>
          <div className="outfit-page__actions">
            <Button
              variant="outline"
              onClick={() => setShowOutfitBuilder(true)}
            >
              コーデを作る
            </Button>
            <Button
              variant="default"
              onClick={() => setShowPostForm(true)}
              disabled={!user}
            >
              投稿する
            </Button>
          </div>
        </div>

        <div className="outfit-page__tabs">
          <Button
            className={`outfit-page__tab ${
              activeTab === "posts" ? "active" : ""
            }`}
            onClick={() => setActiveTab("posts")}
          >
            投稿一覧
          </Button>
          <Button
            className={`outfit-page__tab ${
              activeTab === "builder" ? "active" : ""
            }`}
            onClick={() => setActiveTab("builder")}
          >
            コーデ作成
          </Button>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay error={error} />}

        {activeTab === "posts" && (
          <div className="outfit-page__posts">
            <div className="outfit-page__filters">
              <select
                value={filters.weather || ""}
                onChange={(e) =>
                  updateFilters({ weather: e.target.value || undefined })
                }
                className="outfit-page__filter"
              >
                <option value="">すべての天気</option>
                <option value="sunny">晴れ</option>
                <option value="cloudy">曇り</option>
                <option value="rainy">雨</option>
                <option value="snowy">雪</option>
              </select>

              <select
                value={filters.season || ""}
                onChange={(e) =>
                  updateFilters({ season: e.target.value || undefined })
                }
                className="outfit-page__filter"
              >
                <option value="">すべての季節</option>
                <option value="spring">春</option>
                <option value="summer">夏</option>
                <option value="autumn">秋</option>
                <option value="winter">冬</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilters({})}
              >
                フィルターをクリア
              </Button>
            </div>

            <div className="outfit-page__posts-grid">
              {outfitPosts.map((post) => (
                <OutfitPostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                  onUnlike={() => handleUnlike(post.id)}
                  currentUserId={user?.id}
                />
              ))}
            </div>

            {outfitPosts.length === 0 && !isLoading && (
              <div className="outfit-page__empty">
                <p>投稿がありません</p>
                <Button onClick={() => setShowPostForm(true)}>
                  最初の投稿をしてみましょう
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "builder" && (
          <div className="outfit-page__builder">
            <div className="outfit-page__builder-content">
              <div className="outfit-page__closet">
                <h3>クローゼット</h3>
                <div className="outfit-page__clothing-grid">
                  {clothingItems.map((item) => (
                    <ClothingItemCard
                      key={item.id}
                      item={item}
                      onSelect={() => addToOutfit(item)}
                    />
                  ))}
                </div>
              </div>

              <div className="outfit-page__current-outfit">
                <h3>現在のコーディネート</h3>
                <OutfitBuilder
                  items={clothingItems}
                  weather={selectedWeather || undefined}
                  onOutfitChange={(items: ClothingItem[]) => {
                    // OutfitBuilderから返された配列でcurrentOutfitを更新する
                    // 実際にはuseStateで管理する必要がある
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Post Form Modal */}
        {showPostForm && (
          <Modal
            isOpen={showPostForm}
            onClose={() => setShowPostForm(false)}
            title="新しい投稿"
          >
            <OutfitPostForm
              onSubmit={handleCreatePost}
              onCancel={() => setShowPostForm(false)}
              selectedItems={currentOutfit}
            />
          </Modal>
        )}

        {/* Outfit Builder Modal */}
        {showOutfitBuilder && (
          <Modal
            isOpen={showOutfitBuilder}
            onClose={() => setShowOutfitBuilder(false)}
            title="コーディネート作成"
            size="lg"
          >
            <div className="outfit-builder-modal">
              <OutfitBuilder
                items={clothingItems}
                weather={selectedWeather || undefined}
                onOutfitChange={(items: ClothingItem[]) => {
                  // 選択されたアイテムでcurrentOutfitを更新
                }}
              />
            </div>
          </Modal>
        )}
      </div>

      <style jsx>{`
        .outfit-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .outfit-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .outfit-page__title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }

        .outfit-page__actions {
          display: flex;
          gap: 10px;
        }

        .outfit-page__tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }

        .outfit-page__tab {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-size: 1rem;
        }

        .outfit-page__tab.active {
          border-bottom-color: #007bff;
          color: #007bff;
          font-weight: bold;
        }

        .outfit-page__filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          align-items: center;
        }

        .outfit-page__filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .outfit-page__posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .outfit-page__empty {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .outfit-page__builder-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .outfit-page__clothing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          max-height: 400px;
          overflow-y: auto;
        }

        .outfit-page__clothing-item {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .outfit-page__clothing-item:hover {
          transform: scale(1.05);
        }

        .outfit-builder-modal {
          width: 100%;
          max-width: 800px;
        }

        @media (max-width: 768px) {
          .outfit-page__header {
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
          }

          .outfit-page__actions {
            justify-content: center;
          }

          .outfit-page__builder-content {
            grid-template-columns: 1fr;
          }

          .outfit-page__filters {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </Layout>
  );
};

export default OutfitPage;
