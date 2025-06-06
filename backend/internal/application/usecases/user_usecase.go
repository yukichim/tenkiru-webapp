package usecases

import (
	"errors"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"

	"forecast-app/internal/domain/entities"
	"forecast-app/internal/domain/repositories"
)

// ユーザー関連のビジネスロジックを実装するユースケース
type UserUseCase struct {
	// userRepo ユーザーデータの永続化を担当するリポジトリ
	userRepo repositories.UserRepository
	
	// jwtSecret JWT Token生成・検証用の秘密鍵
	jwtSecret []byte
}

// ユーザーユースケースの新しいインスタンスを作成
func NewUserUseCase(userRepo repositories.UserRepository, jwtSecret string) *UserUseCase {
	return &UserUseCase{
		userRepo:  userRepo,
		jwtSecret: []byte(jwtSecret),
	}
}

// ユーザー登録リクエストの構造体
type RegisterRequest struct {
	Email    string `json:"email"`    // メールアドレス（ログイン認証用）
	Password string `json:"password"` // パスワード（平文で受信、ハッシュ化して保存）
	Name     string `json:"name"`     // ユーザー表示名
}

// ログインリクエストの構造体
type LoginRequest struct {
	Email    string `json:"email"`    // 登録済みメールアドレス
	Password string `json:"password"` // ユーザーパスワード
}

// 認証成功時のレスポンス構造体
type AuthResponse struct {
	User  *entities.User `json:"user"`  // 認証されたユーザー情報（パスワード除外）
	Token string         `json:"token"` // 後続リクエストで使用するJWT Token
}

// 新しいユーザーを登録し、認証トークンを発行
func (uc *UserUseCase) Register(req RegisterRequest) (*AuthResponse, error) {
	// メールアドレスの重複チェック
	existingUser, _ := uc.userRepo.GetByEmail(req.Email)
	if existingUser != nil {
		return nil, errors.New("このメールアドレスは既に使用されています")
	}

	// パスワードのハッシュ化
	// bcrypt アルゴリズムを使用してセキュアに暗号化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("パスワードのハッシュ化に失敗しました: %w", err)
	}

	// ユーザーエンティティの作成
	user := &entities.User{
		Email:     req.Email,
		Password:  string(hashedPassword),
		Name:      req.Name,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// ユーザーデータのバリデーション
	if err := user.Validate(); err != nil {
		return nil, fmt.Errorf("無効なユーザーデータです: %w", err)
	}

	// ユーザーの永続化
	if err := uc.userRepo.Create(user); err != nil {
		return nil, fmt.Errorf("ユーザーの作成に失敗しました: %w", err)
	}

	// JWT トークンの生成
	token, err := uc.generateJWT(user)
	if err != nil {
		return nil, fmt.Errorf("認証トークンの生成に失敗しました: %w", err)
	}

	// セキュリティのためパスワードを除外
	user.Password = ""

	return &AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

// ユーザー認証を行い、成功時に認証トークンを発行
func (uc *UserUseCase) Login(req LoginRequest) (*AuthResponse, error) {
	// メールアドレスでユーザーを検索
	user, err := uc.userRepo.GetByEmail(req.Email)
	if err != nil {
		return nil, errors.New("メールアドレスまたはパスワードが間違っています")
	}

	// パスワードの検証
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return nil, errors.New("メールアドレスまたはパスワードが間違っています")
	}

	// JWT トークンの生成
	token, err := uc.generateJWT(user)
	if err != nil {
		return nil, fmt.Errorf("認証トークンの生成に失敗しました: %w", err)
	}

	// セキュリティのためパスワードを除外
	user.Password = ""

	return &AuthResponse{
		User:  user,
		Token: token,
	}, nil
}

// ユーザーIDからプロフィール情報を取得
func (uc *UserUseCase) GetProfile(userID string) (*entities.User, error) {
	user, err := uc.userRepo.GetByID(userID)
	if err != nil {
		return nil, fmt.Errorf("ユーザーが見つかりません: %w", err)
	}

	// セキュリティのためパスワードを除外
	user.Password = ""

	return user, nil
}

// ユーザープロフィール情報を更新
func (uc *UserUseCase) UpdateProfile(userID string, name string, preferences *entities.UserPreferences) (*entities.User, error) {
	// 既存ユーザーの取得
	user, err := uc.userRepo.GetByID(userID)
	if err != nil {
		return nil, fmt.Errorf("ユーザーが見つかりません: %w", err)
	}

	// ユーザーデータの更新
	user.Name = name
	if preferences != nil {
		user.Preferences = preferences
	}
	user.UpdatedAt = time.Now()

	// 更新されたデータのバリデーション
	if err := user.Validate(); err != nil {
		return nil, fmt.Errorf("無効なユーザーデータです: %w", err)
	}

	// 更新の永続化
	if err := uc.userRepo.Update(user); err != nil {
		return nil, fmt.Errorf("ユーザー情報の更新に失敗しました: %w", err)
	}

	// セキュリティのためパスワードを除外
	user.Password = ""

	return user, nil
}

// JWT トークンを検証し、対応するユーザー情報を取得
func (uc *UserUseCase) ValidateToken(tokenString string) (*entities.User, error) {
	// JWT トークンのパースと検証
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// 署名方式の検証
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("予期しない署名方式です: %v", token.Header["alg"])
		}
		return uc.jwtSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("無効なトークンです: %w", err)
	}

	// トークンクレームの取得と検証
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		userID, ok := claims["user_id"].(string)
		if !ok {
			return nil, errors.New("無効なトークンクレームです")
		}

		// クレーム内のユーザーIDで実際のユーザーを取得
		user, err := uc.userRepo.GetByID(userID)
		if err != nil {
			return nil, fmt.Errorf("ユーザーが見つかりません: %w", err)
		}

		// セキュリティのためパスワードを除外
		user.Password = ""

		return user, nil
	}

	return nil, errors.New("無効なトークンです")
}

// ユーザー情報からJWT トークンを生成
func (uc *UserUseCase) generateJWT(user *entities.User) (string, error) {
	// JWT クレームの設定
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,                                    // ユーザーID
		"email":   user.Email,                                 // メールアドレス
		"exp":     time.Now().Add(time.Hour * 24).Unix(),      // 24時間で期限切れ
	})

	// 秘密鍵で署名してトークン文字列を生成
	return token.SignedString(uc.jwtSecret)
}
