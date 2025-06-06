package handlers

import (
	"encoding/json"
	"net/http"

	"forecast-app/internal/application/usecases"
	"forecast-app/internal/domain/entities"
)

// UserHandler ユーザー関連のHTTPリクエストを処理するハンドラー
type UserHandler struct {
	// userUseCase ユーザー関連のビジネスロジックを実装するユースケース
	// 認証、プロフィール管理、セッション処理などを処理
	userUseCase *usecases.UserUseCase
}

// ユーザーハンドラーの新しいインスタンスを作成
func NewUserHandler(userUseCase *usecases.UserUseCase) *UserHandler {
	return &UserHandler{
		userUseCase: userUseCase,
	}
}

// 新規ユーザー登録を処理するHTTPハンドラー
func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	// HTTPメソッドの検証
	if r.Method != http.MethodPost {
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
		return
	}

	// リクエストボディの解析
	var req usecases.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "無効なリクエストボディです", http.StatusBadRequest)
		return
	}

	// ユースケースでユーザー登録処理を実行
	response, err := h.userUseCase.Register(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// 成功レスポンスの送信
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Login ユーザーログインを処理するHTTPハンドラー
func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	// HTTPメソッドの検証
	if r.Method != http.MethodPost {
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
		return
	}

	// ログイン情報の解析
	// メールアドレスとパスワードを含むJSONリクエストをパース
	var req usecases.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "無効なリクエストボディです", http.StatusBadRequest)
		return
	}

	// ユースケースで認証処理を実行
	// パスワード検証とJWTトークン生成を行う
	response, err := h.userUseCase.Login(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// 認証成功レスポンスの送信
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// GetProfile ユーザープロフィール情報を取得するHTTPハンドラー
func (h *UserHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	// HTTPメソッドの検証
	if r.Method != http.MethodGet {
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
		return
	}

	// 認証ミドルウェアによって設定されたユーザーIDを取得
	// JWTトークンから抽出されたユーザー識別情報を使用
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "認証が必要です", http.StatusUnauthorized)
		return
	}

	// ユースケースでプロフィール情報を取得
	user, err := h.userUseCase.GetProfile(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// プロフィール情報をJSON形式で返却
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// UpdateProfile ユーザープロフィール更新を処理するHTTPハンドラー
// PUT /api/users/profile エンドポイントで呼び出されます
func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	// HTTPメソッドの検証
	if r.Method != http.MethodPut {
		http.Error(w, "許可されていないメソッドです", http.StatusMethodNotAllowed)
		return
	}

	// 認証済みユーザーIDの取得
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "認証が必要です", http.StatusUnauthorized)
		return
	}

	// プロフィール更新情報の解析
	// 名前とファッション好み設定を含むリクエストボディをパース
	var req struct {
		Name        string `json:"name"`         // 更新する表示名
		Preferences struct {
			PreferredColors []string `json:"preferred_colors"` // 好みの色
			PreferredBrands []string `json:"preferred_brands"` // 好みのブランド
			Style           string   `json:"style"`             // 好みのスタイル
		} `json:"preferences"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "無効なリクエストボディです", http.StatusBadRequest)
		return
	}

	// ドメインエンティティへの変換
	// HTTPリクエストデータをビジネスロジック用のエンティティに変換
	preferences := &entities.UserPreferences{
		PreferredColors: req.Preferences.PreferredColors,
		PreferredBrands: req.Preferences.PreferredBrands,
		Style:           req.Preferences.Style,
	}

	// ユースケースでプロフィール更新を実行
	user, err := h.userUseCase.UpdateProfile(userID, req.Name, preferences)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// 更新されたプロフィール情報を返却
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
