"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthController } from "../controllers/AuthController";
import { LoadingSpinner } from "../views/Common";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * ログイン状態を監視するラッパーコンポーネント
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
}) => {
  const { user, isAuthenticated, isLoading } = useAuthController();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, requireAuth, router]);

  // ローディング中は読み込み画面を表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // 認証が必要で未ログインの場合は何も表示しない（リダイレクト処理中）
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
