import { useState } from "react";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import type { User } from "../types";
import { Card, ErrorDisplay } from "./Common";

// ログインフォーム
export interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  onSwitchToRegister: () => void;
  loading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSwitchToRegister,
  loading = false,
  error,
}) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(credentials);
  };

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">ログイン</h2>
        <p className="text-gray-600 mt-2">TENKIRUにログインしてください</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorDisplay error={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス
          </Label>
          <input
            type="email"
            required
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            パスワード
          </Label>
          <input
            type="password"
            required
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="パスワード"
          />
        </div>

        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          アカウントをお持ちでない方は{" "}
          <Button
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            新規登録
          </Button>
        </p>
      </div>
    </Card>
  );
};

// 新規登録フォーム
export interface RegisterFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
  }) => Promise<void>;
  onSwitchToLogin: () => void;
  loading?: boolean;
  error?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateForm = () => {
    const errors: string[] = [];

    if (formData.password.length < 8) {
      errors.push("パスワードは8文字以上で入力してください");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("パスワードが一致しません");
    }

    if (formData.name.length < 2) {
      errors.push("名前は2文字以上で入力してください");
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <Card className="p-8 max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">新規登録</h2>
        <p className="text-gray-600 mt-2">天気を着るのアカウントを作成</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorDisplay error={error} />
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="mb-6">
          <ErrorDisplay error={validationErrors.join(", ")} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            名前
          </Label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="あなたの名前"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス
          </Label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            パスワード
          </Label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="8文字以上のパスワード"
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            パスワード確認
          </Label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="パスワードを再入力"
          />
        </div>

        <Button type="submit" className="w-full">
          アカウント作成
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          すでにアカウントをお持ちの方は{" "}
          <Label
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ログイン
          </Label>
        </p>
      </div>
    </Card>
  );
};

// プロフィール表示
export interface ProfileDisplayProps {
  user: User;
  isOwner?: boolean;
  isOwnProfile?: boolean | null;
  onEdit?: () => void;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({
  user,
  isOwner = false,
  isOwnProfile,
  onEdit,
}) => {
  const shouldShowEdit = isOwner || (isOwnProfile !== null && isOwnProfile);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              参加日: {new Date(user.createdAt).toLocaleDateString("ja-JP")}
            </p>
          </div>
        </div>
        {shouldShowEdit && onEdit && (
          <Button variant="outline" onClick={onEdit}>
            プロフィール編集
          </Button>
        )}
      </div>

      {user.preferences && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">設定</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">デフォルト位置:</span>
              <p className="font-medium">
                {user.preferences.defaultLocation || "未設定"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">温度単位:</span>
              <p className="font-medium">
                {user.preferences.temperatureUnit === "celsius"
                  ? "摂氏"
                  : "華氏"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">通知:</span>
              <p className="font-medium">
                {user.preferences.notifications ? "有効" : "無効"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">プライバシー:</span>
              <p className="font-medium">
                {user.preferences.privacy === "public"
                  ? "公開"
                  : "プライベート"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

// プロフィール編集フォーム
export interface ProfileEditFormProps {
  user: User;
  onSubmit: (updates: Partial<User>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSubmit,
  onCancel,
  loading = false,
  error,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    defaultLocation: user.preferences?.defaultLocation || "",
    temperatureUnit: user.preferences?.temperatureUnit || "celsius",
    notifications: user.preferences?.notifications || false,
    privacy: user.preferences?.privacy || "public",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: formData.name,
      email: formData.email,
      preferences: {
        defaultLocation: formData.defaultLocation,
        temperatureUnit: formData.temperatureUnit as "celsius" | "fahrenheit",
        notifications: formData.notifications,
        privacy: formData.privacy as "public" | "private",
        colors: ["white"],
        preferredBrands: [],
        styles: [],
        preferredColors: [],
        style: "casual",
      },
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        プロフィール編集
      </h2>

      {error && (
        <div className="mb-6">
          <ErrorDisplay error={error} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">基本情報</h3>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              名前
            </Label>
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

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </Label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 設定 */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900">設定</h3>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              デフォルト位置
            </Label>
            <input
              type="text"
              value={formData.defaultLocation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  defaultLocation: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="東京都渋谷区"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              温度単位
            </Label>
            <select
              value={formData.temperatureUnit}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  temperatureUnit: e.target.value as "celsius" | "fahrenheit",
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="celsius">摂氏 (°C)</option>
              <option value="fahrenheit">華氏 (°F)</option>
            </select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              プライバシー設定
            </Label>
            <select
              value={formData.privacy}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  privacy: e.target.value as "public" | "private",
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="public">公開</option>
              <option value="private">プライベート</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="notifications"
              checked={formData.notifications}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notifications: e.target.checked,
                }))
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="notifications"
              className="text-sm font-medium text-gray-700"
            >
              通知を受け取る
            </Label>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200">
          <Button type="submit" className="flex-1">
            更新
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        </div>
      </form>
    </Card>
  );
};

// ユーザー統計
export interface UserStatsProps {
  userId?: string;
  stats?: {
    totalItems: number;
    totalPosts: number;
    totalLikes: number;
    joinedDays: number;
  };
}

export const UserStats: React.FC<UserStatsProps> = ({ userId, stats }) => {
  // Mock stats for now - in a real app, you'd fetch based on userId
  const defaultStats = {
    totalItems: 0,
    totalPosts: 0,
    totalLikes: 0,
    joinedDays: 0,
  };

  const displayStats = stats || defaultStats;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">統計</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {displayStats.totalItems}
          </div>
          <div className="text-sm text-gray-600">アイテム数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {displayStats.totalPosts}
          </div>
          <div className="text-sm text-gray-600">投稿数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {displayStats.totalLikes}
          </div>
          <div className="text-sm text-gray-600">いいね数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {displayStats.joinedDays}
          </div>
          <div className="text-sm text-gray-600">利用日数</div>
        </div>
      </div>
    </Card>
  );
};
