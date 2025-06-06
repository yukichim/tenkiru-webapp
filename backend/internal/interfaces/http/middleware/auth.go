package middleware

import (
	"context"
	"net/http"
	"strings"

	"forecast-app/internal/application/usecases"
)

// AuthMiddleware HTTP認証機能を提供するミドルウェア
type AuthMiddleware struct {
	// userUseCase ユーザー認証・認可ロジックを処理するユースケース
	// JWT トークンの検証とユーザー情報の取得を担当
	userUseCase *usecases.UserUseCase
}

// NewAuthMiddleware 認証ミドルウェアの新しいインスタンスを作成します
func NewAuthMiddleware(userUseCase *usecases.UserUseCase) *AuthMiddleware {
	return &AuthMiddleware{
		userUseCase: userUseCase,
	}
}

// RequireAuth 認証が必須のエンドポイント用ミドルウェア
func (m *AuthMiddleware) RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "認証ヘッダーが必要です", http.StatusUnauthorized)
			return
		}

		// Bearer トークン形式の検証
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "無効な認証形式です", http.StatusUnauthorized)
			return
		}

		// JWT トークンの抽出
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if token == "" {
			http.Error(w, "認証トークンが必要です", http.StatusUnauthorized)
			return
		}

		// トークンの検証とユーザー情報の取得
		user, err := m.userUseCase.ValidateToken(token)
		if err != nil {
			http.Error(w, "無効または期限切れのトークンです", http.StatusUnauthorized)
			return
		}

		// ユーザー情報をリクエストコンテキストに追加
		ctx := context.WithValue(r.Context(), "user_id", user.ID)
		ctx = context.WithValue(ctx, "user", user)

		// 更新されたコンテキストで次のハンドラーを呼び出し
		next(w, r.WithContext(ctx))
	}
}

// OptionalAuth 認証が任意のエンドポイント用ミドルウェア
func (m *AuthMiddleware) OptionalAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Authorization ヘッダーの確認（任意）
		authHeader := r.Header.Get("Authorization")
		if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
			// トークンが提供されている場合のみ検証を実行
			token := strings.TrimPrefix(authHeader, "Bearer ")
			if token != "" {
				// トークン検証（エラーは無視）
				user, err := m.userUseCase.ValidateToken(token)
				if err == nil {
					// 有効なトークンの場合のみコンテキストに設定
					ctx := context.WithValue(r.Context(), "user_id", user.ID)
					ctx = context.WithValue(ctx, "user", user)
					r = r.WithContext(ctx)
				}
			}
		}

		// 認証状態に関係なく次のハンドラーを呼び出し
		next(w, r)
	}
}

// CORS Cross-Origin Resource Sharing 設定を提供するミドルウェア
func (m *AuthMiddleware) CORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// CORS ヘッダーの設定
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// プリフライトリクエストの処理
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// 通常のリクエストを次のハンドラーに渡す
		next(w, r)
	}
}
