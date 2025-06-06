"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { useAuthController } from "../../controllers/AuthController";
import { useClothingController } from "../../controllers/ClothingController";
import { useOutfitController } from "../../controllers/OutfitController";
import type { User } from "../../types";
import { ProfileDisplay, ProfileEditForm, UserStats } from "../AuthComponents";
import { ClothingItemCard } from "../ClothingComponents";
import { Card, Layout, LoadingSpinner, Modal } from "../Common";
import { OutfitPostCard } from "../OutfitComponents";

interface ProfilePageProps {
  userId?: string;
}

export const ProfilePage: FC<ProfilePageProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "posts" | "closet" | "stats"
  >("overview");
  const [showEditForm, setShowEditForm] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const {
    user: currentUser,
    isLoading: authLoading,
    updateProfile,
    getUserById,
  } = useAuthController();

  const {
    clothingItems,
    isLoading: clothingLoading,
    getUserClothing,
    getClothingStats,
  } = useClothingController();

  const {
    outfitPosts,
    isLoading: outfitLoading,
    getUserPosts,
    likePost,
    unlikePost,
  } = useOutfitController();

  const isOwnProfile = !userId || (currentUser && userId === currentUser.id);
  const displayUser = profileUser || currentUser;

  useEffect(() => {
    if (userId && userId !== currentUser?.id) {
      // Load other user's profile
      getUserById(userId).then(setProfileUser);
    } else if (currentUser) {
      // Use current user's profile
      setProfileUser(currentUser);
    }
  }, [userId, currentUser, getUserById]);

  useEffect(() => {
    if (displayUser) {
      getUserClothing(displayUser.id);
      getUserPosts(displayUser.id);
    }
  }, [displayUser, getUserClothing, getUserPosts]);

  const handleUpdateProfile = async (profileData: Partial<User>) => {
    if (!currentUser) return;

    try {
      await updateProfile(profileData);
      setShowEditForm(false);
    } catch (error) {
      // Error is already handled in the AuthController
      console.error("Profile update failed:", error);
    }
  };

  const handleLike = async (postId: string) => {
    await likePost(postId);
    if (displayUser) {
      getUserPosts(displayUser.id);
    }
  };

  const handleUnlike = async (postId: string) => {
    await unlikePost(postId);
    if (displayUser) {
      getUserPosts(displayUser.id);
    }
  };

  const isLoading = authLoading || clothingLoading || outfitLoading;

  if (!displayUser) {
    return (
      <Layout>
        <div className="profile-page">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-page__header">
          <ProfileDisplay
            user={displayUser}
            isOwnProfile={isOwnProfile}
            onEdit={() => setShowEditForm(true)}
          />
        </div>

        <div className="profile-page__tabs">
          <button
            type="button"
            className={`profile-page__tab ${
              activeTab === "overview" ? "active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            概要
          </button>
          <button
            type="button"
            className={`profile-page__tab ${
              activeTab === "posts" ? "active" : ""
            }`}
            onClick={() => setActiveTab("posts")}
          >
            投稿 ({outfitPosts.length})
          </button>
          <button
            type="button"
            className={`profile-page__tab ${
              activeTab === "closet" ? "active" : ""
            }`}
            onClick={() => setActiveTab("closet")}
          >
            クローゼット ({clothingItems.length})
          </button>
          <button
            type="button"
            className={`profile-page__tab ${
              activeTab === "stats" ? "active" : ""
            }`}
            onClick={() => setActiveTab("stats")}
          >
            統計
          </button>
        </div>

        {isLoading && <LoadingSpinner />}

        <div className="profile-page__content">
          {activeTab === "overview" && (
            <div className="profile-page__overview">
              <div className="profile-page__overview-grid">
                <Card className="profile-page__overview-card">
                  <h3>最近の活動</h3>
                  <div className="profile-page__recent-activity">
                    {outfitPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="profile-page__activity-item"
                      >
                        <img
                          src={post.imageUrl || "/api/placeholder/50/50"}
                          alt={post.title}
                          className="profile-page__activity-image"
                        />
                        <div className="profile-page__activity-details">
                          <p className="profile-page__activity-title">
                            {post.title}
                          </p>
                          <p className="profile-page__activity-date">
                            {new Date(post.createdAt).toLocaleDateString(
                              "ja-JP"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                    {outfitPosts.length === 0 && (
                      <p className="profile-page__no-activity">
                        最近の活動がありません
                      </p>
                    )}
                  </div>
                </Card>

                <Card className="profile-page__overview-card">
                  <h3>よく着る服</h3>
                  <div className="profile-page__favorite-items">
                    {clothingItems.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="profile-page__favorite-item"
                      >
                        <img
                          src={item.imageUrl || "/api/placeholder/40/40"}
                          alt={item.name}
                          className="profile-page__favorite-image"
                        />
                        <span className="profile-page__favorite-name">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="profile-page__overview-card">
                  <h3>プロフィール情報</h3>
                  <div className="profile-page__info">
                    <div className="profile-page__info-item">
                      <strong>登録日:</strong>
                      <span>
                        {new Date(displayUser.createdAt).toLocaleDateString(
                          "ja-JP"
                        )}
                      </span>
                    </div>
                    {displayUser.location && (
                      <div className="profile-page__info-item">
                        <strong>場所:</strong>
                        <span>{displayUser.location}</span>
                      </div>
                    )}
                    {displayUser.bio && (
                      <div className="profile-page__info-item">
                        <strong>自己紹介:</strong>
                        <p>{displayUser.bio}</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="profile-page__posts">
              {outfitPosts.length === 0 ? (
                <div className="profile-page__empty">
                  <h3>投稿がありません</h3>
                  <p>
                    {isOwnProfile
                      ? "最初の投稿をしてみましょう！"
                      : "まだ投稿がありません。"}
                  </p>
                </div>
              ) : (
                <div className="profile-page__posts-grid">
                  {outfitPosts.map((post) => (
                    <OutfitPostCard
                      key={post.id}
                      post={post}
                      onLike={() => handleLike(post.id)}
                      onUnlike={() => handleUnlike(post.id)}
                      currentUserId={currentUser?.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "closet" && (
            <div className="profile-page__closet">
              {clothingItems.length === 0 ? (
                <div className="profile-page__empty">
                  <h3>クローゼットが空です</h3>
                  <p>
                    {isOwnProfile
                      ? "服を追加してクローゼットを充実させましょう！"
                      : "まだ服が登録されていません。"}
                  </p>
                </div>
              ) : (
                <div className="profile-page__closet-grid">
                  {clothingItems.map((item) => (
                    <ClothingItemCard
                      key={item.id}
                      item={item}
                      showActions={isOwnProfile || undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="profile-page__stats">
              <UserStats userId={displayUser.id} />
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {showEditForm && isOwnProfile && (
          <Modal
            isOpen={showEditForm}
            onClose={() => setShowEditForm(false)}
            title="プロフィール編集"
          >
            <ProfileEditForm
              user={displayUser}
              onSubmit={handleUpdateProfile}
              onCancel={() => setShowEditForm(false)}
            />
          </Modal>
        )}
      </div>

      <style jsx>{`
        .profile-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-page__header {
          margin-bottom: 30px;
        }

        .profile-page__tabs {
          display: flex;
          border-bottom: 1px solid #ddd;
          margin-bottom: 30px;
        }

        .profile-page__tab {
          padding: 12px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .profile-page__tab.active {
          border-bottom-color: #007bff;
          color: #007bff;
          font-weight: bold;
        }

        .profile-page__overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .profile-page__overview-card {
          padding: 20px;
        }

        .profile-page__overview-card h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .profile-page__recent-activity {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .profile-page__activity-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .profile-page__activity-image {
          width: 50px;
          height: 50px;
          border-radius: 5px;
          object-fit: cover;
        }

        .profile-page__activity-title {
          font-weight: 500;
          margin: 0;
        }

        .profile-page__activity-date {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }

        .profile-page__favorite-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
          gap: 10px;
        }

        .profile-page__favorite-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          text-align: center;
        }

        .profile-page__favorite-image {
          width: 40px;
          height: 40px;
          border-radius: 5px;
          object-fit: cover;
        }

        .profile-page__favorite-name {
          font-size: 0.8rem;
          color: #555;
        }

        .profile-page__info {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .profile-page__info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .profile-page__info-item strong {
          color: #333;
        }

        .profile-page__posts-grid,
        .profile-page__closet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .profile-page__empty {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .profile-page__empty h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .profile-page__no-activity {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .profile-page {
            padding: 10px;
          }

          .profile-page__tabs {
            overflow-x: auto;
            white-space: nowrap;
          }

          .profile-page__tab {
            min-width: 100px;
          }

          .profile-page__overview-grid {
            grid-template-columns: 1fr;
          }

          .profile-page__posts-grid,
          .profile-page__closet-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Layout>
  );
};

export default ProfilePage;
