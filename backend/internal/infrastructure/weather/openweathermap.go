package weather

import (
	"encoding/json"
	"fmt"
	"net/http"

	"forecast-app/internal/domain/entities"
)

// OpenWeatherMap API との統合を実装する構造体
type OpenWeatherMapAPI struct {
	apiKey string
	client *http.Client
}

// OpenWeatherMap API クライアントの新しいインスタンスを作成（ファクトリ）
func NewOpenWeatherMapAPI(apiKey string) *OpenWeatherMapAPI {
	return &OpenWeatherMapAPI{
		apiKey: apiKey,
		client: &http.Client{},
	}
}

// OpenWeatherMapResponse OpenWeatherMap API からのレスポンス構造体
type OpenWeatherMapResponse struct {
	// Main 主要な気象データ（温度、湿度など）
	Main struct {
		Temp      float64 `json:"temp"`       // 気温（摂氏）
		FeelsLike float64 `json:"feels_like"` // 体感温度（摂氏）
		Humidity  int     `json:"humidity"`   // 湿度（パーセント）
	} `json:"main"`
	
	// Weather 天気状況の配列（通常は1つの要素）
	Weather []struct {
		Main        string `json:"main"`        // 主要な天気状況（Rain, Snow, Clear など）
		Description string `json:"description"` // 詳細な天気説明
	} `json:"weather"`
	
	// Wind 風に関する情報
	Wind struct {
		Speed float64 `json:"speed"` // 風速（m/s）
	} `json:"wind"`
	
	// Clouds 雲量情報
	Clouds struct {
		All int `json:"all"` // 雲量（パーセント）
	} `json:"clouds"`
	
	// Name 地域名
	Name string `json:"name"`
}

//  緯度経度から現在の天気情報を取得
func (w *OpenWeatherMapAPI) GetByLocation(latitude, longitude float64) (*entities.WeatherCondition, error) {
	// OpenWeatherMap API URL の構築
	url := fmt.Sprintf(
		"https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&appid=%s&units=metric",
		latitude, longitude, w.apiKey,
	)

	// HTTP GET リクエストの実行
	resp, err := w.client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("天気データの取得に失敗しました: %w", err)
	}
	defer resp.Body.Close()

	// HTTP ステータスコードの確認
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("天気API がステータス %d を返しました", resp.StatusCode)
	}

	// JSON レスポンスのパース
	var weatherResp OpenWeatherMapResponse
	if err := json.NewDecoder(resp.Body).Decode(&weatherResp); err != nil {
		return nil, fmt.Errorf("天気レスポンスのデコードに失敗しました: %w", err)
	}

	// 外部APIデータを内部ドメインエンティティに変換
	weatherCondition := &entities.WeatherCondition{
		Temperature: weatherResp.Main.Temp,       // 気温
		FeelsLike:   weatherResp.Main.FeelsLike,  // 体感温度
		Humidity:    weatherResp.Main.Humidity,   // 湿度
		WindSpeed:   weatherResp.Wind.Speed,      // 風速
		CloudCover:  weatherResp.Clouds.All,      // 雲量
		Location:    weatherResp.Name,            // 地域名
	}

	// 天気状況情報の設定（配列の最初の要素を使用）
	if len(weatherResp.Weather) > 0 {
		weatherCondition.Condition = weatherResp.Weather[0].Main           // 主要天気状況
		weatherCondition.Description = weatherResp.Weather[0].Description  // 詳細説明
	}

	return weatherCondition, nil
}
