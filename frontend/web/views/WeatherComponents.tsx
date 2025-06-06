import type React from "react";
import type { WeatherCondition } from "../types";
import { Card } from "./Common";

export interface WeatherCardProps {
	weather: WeatherCondition;
	location?: string;
	showDetails?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
	weather,
	location,
	showDetails = true,
}) => {
	const getWeatherIcon = (condition: string) => {
		const iconMap: Record<string, string> = {
			sunny: "☀️",
			cloudy: "☁️",
			rainy: "🌧️",
			snowy: "❄️",
			thunderstorm: "⛈️",
			foggy: "🌫️",
			windy: "💨",
		};
		return iconMap[condition.toLowerCase()] || "🌤️";
	};

	const getTemperatureColor = (temp: number) => {
		if (temp >= 30) return "text-red-600";
		if (temp >= 25) return "text-orange-500";
		if (temp >= 20) return "text-yellow-500";
		if (temp >= 15) return "text-green-500";
		if (temp >= 10) return "text-blue-500";
		return "text-blue-700";
	};

	return (
		<Card className="p-6">
			<div className="flex items-center justify-between mb-4">
				<div>
					{location && <p className="text-sm text-gray-600 mb-1">{location}</p>}
					<div className="flex items-center space-x-2">
						<span className="text-3xl">
							{getWeatherIcon(weather.condition)}
						</span>
						<span
							className={`text-3xl font-bold ${getTemperatureColor(weather.temperature)}`}
						>
							{Math.round(weather.temperature)}°C
						</span>
					</div>
				</div>
				<div className="text-right">
					<p className="text-sm text-gray-600 capitalize">
						{weather.condition}
					</p>
					<p className="text-xs text-gray-500">
						体感 {Math.round(weather.feelsLike)}°C
					</p>
				</div>
			</div>

			{showDetails && (
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-600">湿度:</span>
						<span className="font-medium">{weather.humidity}%</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">風速:</span>
						<span className="font-medium">{weather.windSpeed} m/s</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">気圧:</span>
						<span className="font-medium">{weather.pressure} hPa</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">雲量:</span>
						<span className="font-medium">{weather.cloudCover}%</span>
					</div>
				</div>
			)}
		</Card>
	);
};

// 天気予報コンポーネント
export interface WeatherForecastProps {
	forecasts: (WeatherCondition & { date: string })[];
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({
	forecasts,
}) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return "今日";
		}
		if (date.toDateString() === tomorrow.toDateString()) {
			return "明日";
		}
		return date.toLocaleDateString("ja-JP", {
			month: "short",
			day: "numeric",
			weekday: "short",
		});
	};

	const getWeatherIcon = (condition: string) => {
		const iconMap: Record<string, string> = {
			sunny: "☀️",
			cloudy: "☁️",
			rainy: "🌧️",
			snowy: "❄️",
			thunderstorm: "⛈️",
			foggy: "🌫️",
			windy: "💨",
		};
		return iconMap[condition.toLowerCase()] || "🌤️";
	};

	return (
		<Card className="p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">天気予報</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{forecasts.map((forecast, index) => (
					<div
						key={crypto.randomUUID()}
						className="text-center p-4 bg-gray-50 rounded-lg"
					>
						<p className="text-sm font-medium text-gray-900 mb-2">
							{formatDate(forecast.date)}
						</p>
						<div className="text-2xl mb-2">
							{getWeatherIcon(forecast.condition)}
						</div>
						<p className="text-lg font-bold text-gray-900">
							{Math.round(forecast.temperature)}°C
						</p>
						<p className="text-xs text-gray-600 capitalize">
							{forecast.condition}
						</p>
						<div className="mt-2 text-xs text-gray-500">
							<p>湿度 {forecast.humidity}%</p>
							<p>風速 {forecast.windSpeed}m/s</p>
						</div>
					</div>
				))}
			</div>
		</Card>
	);
};

// 天気アラートコンポーネント
export interface WeatherAlertProps {
	alerts: {
		type: "warning" | "watch" | "advisory";
		title: string;
		description: string;
		severity: "low" | "medium" | "high";
	}[];
}

export const WeatherAlert: React.FC<WeatherAlertProps> = ({ alerts }) => {
	if (alerts.length === 0) return null;

	const getAlertIcon = (type: string) => {
		switch (type) {
			case "warning":
				return "⚠️";
			case "watch":
				return "👀";
			case "advisory":
				return "ℹ️";
			default:
				return "⚠️";
		}
	};

	const getAlertColor = (severity: string) => {
		switch (severity) {
			case "high":
				return "border-red-200 bg-red-50 text-red-800";
			case "medium":
				return "border-yellow-200 bg-yellow-50 text-yellow-800";
			case "low":
				return "border-blue-200 bg-blue-50 text-blue-800";
			default:
				return "border-gray-200 bg-gray-50 text-gray-800";
		}
	};

	return (
		<div className="space-y-3">
			{alerts.map((alert, index) => (
				<div
					key={crypto.randomUUID()}
					className={`border rounded-lg p-4 ${getAlertColor(alert.severity)}`}
				>
					<div className="flex items-start space-x-3">
						<span className="text-xl">{getAlertIcon(alert.type)}</span>
						<div className="flex-1">
							<h4 className="font-semibold">{alert.title}</h4>
							<p className="text-sm mt-1">{alert.description}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

// 天気に基づく服装推奨コンポーネント
export interface WeatherClothingAdviceProps {
	weather: WeatherCondition;
}

export const WeatherClothingAdvice: React.FC<WeatherClothingAdviceProps> = ({
	weather,
}) => {
	const getClothingAdvice = (weather: WeatherCondition) => {
		const { temperature, condition, humidity, windSpeed } = weather;

		const advice: string[] = [];
		let warmthLevel = "";

		// 温度による基本的な推奨
		if (temperature >= 30) {
			warmthLevel = "非常に暑い";
			advice.push("薄手の半袖やノースリーブ");
			advice.push("通気性の良い素材");
			advice.push("日焼け止めと帽子");
		} else if (temperature >= 25) {
			warmthLevel = "暑い";
			advice.push("半袖シャツ");
			advice.push("軽いパンツやスカート");
		} else if (temperature >= 20) {
			warmthLevel = "暖かい";
			advice.push("長袖シャツ");
			advice.push("軽いジャケット（朝夕用）");
		} else if (temperature >= 15) {
			warmthLevel = "涼しい";
			advice.push("セーターや薄手のニット");
			advice.push("軽いアウター");
		} else if (temperature >= 10) {
			warmthLevel = "寒い";
			advice.push("厚手のアウター");
			advice.push("長袖のインナー");
		} else {
			warmthLevel = "非常に寒い";
			advice.push("厚手のコートやダウン");
			advice.push("マフラーや手袋");
		}

		// 天気条件による追加推奨
		if (condition.includes("rain")) {
			advice.push("レインコートや傘");
			advice.push("防水シューズ");
		}

		if (condition.includes("snow")) {
			advice.push("防寒ブーツ");
			advice.push("防水性のあるアウター");
		}

		if (windSpeed > 5) {
			advice.push("風を通しにくいアウター");
		}

		if (humidity > 80) {
			advice.push("吸湿性の良い素材");
		}

		return { warmthLevel, advice };
	};

	const { warmthLevel, advice } = getClothingAdvice(weather);

	return (
		<Card className="p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-4">
				今日の服装アドバイス
			</h3>
			<div className="mb-4">
				<span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
					{warmthLevel}
				</span>
			</div>
			<ul className="space-y-2">
				{advice.map((item, index) => (
					<li key={crypto.randomUUID()} className="flex items-start space-x-2">
						<span className="text-indigo-500 mt-1">•</span>
						<span className="text-gray-700">{item}</span>
					</li>
				))}
			</ul>
		</Card>
	);
};
