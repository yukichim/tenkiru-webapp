"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { useAuthController } from "../../controllers/AuthController";
import { useOutfitController } from "../../controllers/OutfitController";
import type { OutfitPost } from "../../types";
import { ErrorDisplay, Layout, LoadingSpinner, Modal } from "../Common";
import { OutfitPostCard, OutfitPostForm } from "../OutfitComponents";

export const PostsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "following" | "mine">(
    "all"
  );
  const [showPostForm, setShowPostForm] = useState(false);

  const { user } = useAuthController();

  const {
    outfitPosts,
    isLoading,
    error,
    filters,
    updateFilters,
    createOutfitPost,
    likePost,
    unlikePost,
    deletePost,
    refreshPosts,
  } = useOutfitController();

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts, activeTab]);

  const handleCreatePost = async (postData: Partial<OutfitPost>) => {
    if (!user) return;

    const success = await createOutfitPost({
      ...postData,
      userId: user.id,
      createdAt: new Date().toISOString(),
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

  const handleDelete = async (postId: string) => {
    if (confirm("この投稿を削除しますか？")) {
      await deletePost(postId);
      refreshPosts();
    }
  };

  const filteredPosts = outfitPosts.filter((post) => {
    switch (activeTab) {
      case "mine":
        return user && post.userId === user.id;
      case "following":
        // TODO: Implement following logic
        return true;
      default:
        return true;
    }
  });

  return (
    <Layout>
      <div className="posts-page">
        <div className="posts-page__header">
          <h1 className="posts-page__title">投稿一覧</h1>
          <Button onClick={() => setShowPostForm(true)} disabled={!user}>
            新しい投稿
          </Button>
        </div>

        <div className="posts-page__tabs">
          <Button
            className={`posts-page__tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            すべて
          </Button>
          <Button
            className={`posts-page__tab ${
              activeTab === "following" ? "active" : ""
            }`}
            onClick={() => setActiveTab("following")}
            disabled={!user}
          >
            フォロー中
          </Button>
          <Button
            className={`posts-page__tab ${
              activeTab === "mine" ? "active" : ""
            }`}
            onClick={() => setActiveTab("mine")}
            disabled={!user}
          >
            自分の投稿
          </Button>
        </div>

        <div className="posts-page__filters">
          <div className="posts-page__filter-group">
            <label>天気で絞り込み:</label>
            <select
              value={filters.weather || ""}
              onChange={(e) =>
                updateFilters({ weather: e.target.value || undefined })
              }
              className="posts-page__filter"
            >
              <option value="">すべて</option>
              <option value="sunny">晴れ</option>
              <option value="cloudy">曇り</option>
              <option value="rainy">雨</option>
              <option value="snowy">雪</option>
            </select>
          </div>

          <div className="posts-page__filter-group">
            <label>季節で絞り込み:</label>
            <select
              value={filters.season || ""}
              onChange={(e) =>
                updateFilters({ season: e.target.value || undefined })
              }
              className="posts-page__filter"
            >
              <option value="">すべて</option>
              <option value="spring">春</option>
              <option value="summer">夏</option>
              <option value="autumn">秋</option>
              <option value="winter">冬</option>
            </select>
          </div>

          <div className="posts-page__filter-group">
            <label>気温で絞り込み:</label>
            <select
              value={filters.temperature || ""}
              onChange={(e) =>
                updateFilters({ temperature: e.target.value || undefined })
              }
              className="posts-page__filter"
            >
              <option value="">すべて</option>
              <option value="cold">寒い (10°C以下)</option>
              <option value="cool">涼しい (11-20°C)</option>
              <option value="warm">暖かい (21-25°C)</option>
              <option value="hot">暑い (26°C以上)</option>
            </select>
          </div>

          <Button variant="outline" size="sm" onClick={() => updateFilters({})}>
            フィルターをクリア
          </Button>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorDisplay error={error} />}

        <div className="posts-page__content">
          {filteredPosts.length === 0 && !isLoading ? (
            <div className="posts-page__empty">
              <h3>投稿がありません</h3>
              <p>
                {activeTab === "mine"
                  ? "最初の投稿をしてみましょう！"
                  : "投稿がまだありません。"}
              </p>
              {activeTab === "mine" && (
                <Button onClick={() => setShowPostForm(true)}>
                  投稿を作成
                </Button>
              )}
            </div>
          ) : (
            <div className="posts-page__grid">
              {filteredPosts.map((post) => (
                <OutfitPostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                  onUnlike={() => handleUnlike(post.id)}
                  onDelete={
                    user && post.userId === user.id
                      ? () => handleDelete(post.id)
                      : undefined
                  }
                  currentUserId={user?.id}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="posts-page__fab">
          <Button
            variant="default"
            size="lg"
            onClick={() => setShowPostForm(true)}
            disabled={!user}
            className="posts-page__fab-button"
          >
            +
          </Button>
        </div>

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
            />
          </Modal>
        )}
      </div>

      <style jsx>{`
        .posts-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .posts-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .posts-page__title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }

        .posts-page__tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 20px;
        }

        .posts-page__tab {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .posts-page__tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .posts-page__tab.active {
          border-bottom-color: #007bff;
          color: #007bff;
          font-weight: bold;
        }

        .posts-page__filters {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .posts-page__filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .posts-page__filter-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
        }

        .posts-page__filter {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 0.9rem;
        }

        .posts-page__content {
          min-height: 400px;
        }

        .posts-page__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .posts-page__empty {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .posts-page__empty h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .posts-page__empty p {
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        .posts-page__fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .posts-page__fab-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          font-size: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .posts-page {
            padding: 10px;
          }

          .posts-page__header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .posts-page__filters {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .posts-page__filter-group {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .posts-page__grid {
            grid-template-columns: 1fr;
          }

          .posts-page__header Button {
            display: none;
          }
        }
      `}</style>
    </Layout>
  );
};

export default PostsPage;
