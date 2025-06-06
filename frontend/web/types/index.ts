/**
 * ユーザー基本情報
 */
export interface User {
  id: string;
  name: string;
  email: string;
  gender?: string;
  age?: number;
  location?: string;
  bio?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  styles: string[];
  colors: string[];
  preferredColors: string[];
  preferredBrands: string[];
  style: string;
  defaultLocation?: string;
  temperatureUnit: "celsius" | "fahrenheit";
  notifications: boolean;
  privacy: "public" | "private";
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  gender?: string;
  age?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Weather types
export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  dateTime: string;
}

export interface WeatherCondition {
  temperature: number;
  feelsLike: number;
  description: string;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  cloudCover: number;
  location: string;
  dateTime: string;
  pressure: number;
}

export interface WeatherAlert {
  type: "warning" | "watch" | "advisory";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface WeatherForecast {
  location: { lat: number; lon: number };
  daily: WeatherForecastDaily[];
  hourly: WeatherCondition[];
  lastUpdated: string;
}

export interface WeatherForecastDaily extends WeatherCondition {
  date: string;
}

// Clothing types
export interface Clothing {
  id: number;
  name: string;
  category: string;
  color: string;
  type: string;
}

export interface ClothingItem {
  id: string;
  userId: string;
  name: string;
  type: string;
  color: string;
  size: string;
  season: string[];
  description?: string;
  category: string;
  brand: string;
  warmthLevel: number;
  imageUrl: string;
  createdAt: string;
}

export interface ClothingCategory {
  id: string;
  name: string;
}

export interface CreateClothingRequest {
  name: string;
  category: string;
  color: string;
  brand: string;
  imageUrl: string;
  warmthLevel: number;
}

// Fashion types
export interface RecommendedItem {
  category: string;
  name: string;
  color: string;
  reason: string;
}

export interface FashionRecommendation {
  id: string;
  userId: string;
  style: string;
  items: RecommendedItem[];
  weather: WeatherCondition;
  reason: string;
  location: string;
  createdAt: string;
}

export interface RecommendationRequest {
  userId?: string;
  latitude: number;
  longitude: number;
  location: string;
}

// Outfit types
export interface OutfitPost {
  id: string;
  userId: string;
  userName: string;
  title: string;
  items: string[];
  description: string;
  tags: string[];
  weather: WeatherCondition;
  temperature: number;
  location: string;
  imageUrl: string;
  createdAt: string;
  likes: number;
}

export interface CreateOutfitPostRequest {
  items: string[];
  description: string;
  tags: string[];
  weather: WeatherCondition;
  temperature: number;
  location: string;
  imageUrl: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Location types
export interface Location {
  lat: number;
  lon: number;
  name: string;
}
