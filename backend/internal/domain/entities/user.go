package entities

import (
	"time"
	"errors"
)

type User struct {
	ID          string
	Name        string
	Email       string
	Password    string
	Gender      string
	Age         int
	Preferences *UserPreferences
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// ユーザーのファッション関連の設定を表現
type UserPreferences struct {
	Styles          []string  // 好みのファッションスタイル（カジュアル、フォーマルなど）
	Colors          []string  // 好みの色彩
	PreferredColors []string  // 特に好む色の組み合わせ
	PreferredBrands []string  // 好みのブランド
	Style           string    // メインのスタイル指向
}

// バリデーション付きで新しいユーザーを作成
func NewUser(name, email, password string) (*User, error) {
	if name == "" {
		return nil, errors.New("name is required")
	}
	if email == "" {
		return nil, errors.New("email is required")
	}
	if password == "" {
		return nil, errors.New("password is required")
	}

	return &User{
		Name:      name,
		Email:     email,
		Password:  password,
		CreatedAt: time.Now(),
	}, nil
}

// ユーザーのファッション設定を更新
func (u *User) UpdatePreferences(styles, colors []string) {
	u.Preferences = &UserPreferences{
		Styles: styles,
		Colors: colors,
	}
}

// 年齢が有効な範囲内であるかを確認
func (u *User) IsValidAge() bool {
	return u.Age >= 0 && u.Age <= 150
}

// ユーザーエンティティの整合性を検証
func (u *User) Validate() error {
	if u.Name == "" {
		return errors.New("name is required")
	}
	if u.Email == "" {
		return errors.New("email is required")
	}
	if u.Password == "" {
		return errors.New("password is required")
	}
	return nil
}
