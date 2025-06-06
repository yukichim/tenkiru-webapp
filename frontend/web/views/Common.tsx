"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { useAuthController } from "../controllers/AuthController";

// 共通レイアウトコンポーネント
export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title = "天気を着る",
  showNavigation = true,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {title}
              </Link>
            </div>
            {showNavigation && <Navigation />}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

// ナビゲーションコンポーネント
const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthController();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <nav className="flex space-x-4 items-center">
        <Link
          href="/"
          className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
        >
          ホーム
        </Link>
        <Link
          href="/weather"
          className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
        >
          天気
        </Link>
        <Link
          href="/login"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          ログイン
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex space-x-4 items-center">
      <Link
        href="/"
        className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
      >
        ホーム
      </Link>
      <Link
        href="/weather"
        className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
      >
        天気
      </Link>
      <Link
        href="/closet"
        className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
      >
        クローゼット
      </Link>
      <Link
        href="/outfit"
        className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
      >
        コーディネート
      </Link>
      <Link
        href="/posts"
        className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
      >
        投稿
      </Link>
      <Link
        href="/profile"
        className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
      >
        プロフィール
      </Link>

      <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200">
        <span className="text-sm text-gray-600">
          こんにちは、{user?.name}さん
        </span>
        <Button onClick={handleLogout} variant="outline" size="sm">
          ログアウト
        </Button>
      </div>
    </nav>
  );
};

// ローディングコンポーネント
export const Loading: React.FC<{ message?: string }> = ({
  message = "読み込み中...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

// ローディングスピナーコンポーネント
export interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "blue" | "gray" | "white";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "blue",
  className = "",
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const colorClasses = {
    blue: "border-indigo-600",
    gray: "border-gray-600",
    white: "border-white",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]}`}
      />
    </div>
  );
};

// エラーコンポーネント
export interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            role="img"
            aria-label="err"
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{error}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex space-x-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="text-sm text-red-600 hover:text-red-500 font-medium"
            >
              再試行
            </Button>
          )}
          {onDismiss && (
            <Button
              onClick={onDismiss}
              className="text-sm text-red-600 hover:text-red-500 font-medium"
            >
              閉じる
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// 空状態コンポーネント
export interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">{icon}</div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

// カードコンポーネント
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  hoverable = false,
}) => {
  const baseClasses = "bg-white rounded-lg shadow-sm border";
  const hoverClasses = hoverable
    ? "hover:shadow-md transition-shadow duration-200"
    : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  return (
    <Button
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

// モーダルコンポーネント
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <Button
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div
          className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} sm:w-full sm:p-6`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
            <Button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                role="img"
                aria-label="close"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
