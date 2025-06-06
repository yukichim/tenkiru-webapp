import Cookies from "js-cookie";
import type { User } from "../types";

export class AuthUtils {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USER_KEY = "user_data";
  private constructor() {}

  public static setToken(token: string): void {
    Cookies.set(AuthUtils.TOKEN_KEY, token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  public static getToken(): string | null {
    return Cookies.get(AuthUtils.TOKEN_KEY) || null;
  }

  public static removeToken(): void {
    Cookies.remove(AuthUtils.TOKEN_KEY);
  }

  public static setUser(user: User): void {
    localStorage.setItem(AuthUtils.USER_KEY, JSON.stringify(user));
  }

  public static getUser(): User | null {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem(AuthUtils.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  public static removeUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AuthUtils.USER_KEY);
    }
  }

  public static isAuthenticated(): boolean {
    return AuthUtils.getToken() !== null;
  }

  public static logout(): void {
    AuthUtils.removeToken();
    AuthUtils.removeUser();
  }
}

/**
 * 地点関連のユーティリティクラス
 */
export class LocationUtils {
  public static getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      });
    });
  }

  public static async getLocationName(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      // Using a reverse geocoding service - in production, you'd use a proper service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ja`
      );
      const data = await response.json();
      return (
        data.city || data.locality || data.principalSubdivision || "未知の場所"
      );
    } catch (error) {
      console.error("Failed to get location name:", error);
      return "未知の場所";
    }
  }
  public async getCurrentPosition() {}
}

// Storage utilities
export class StorageUtils {
  private constructor() {}

  public static setItem(key: string, value: any): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public static getItem<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  public static removeItem(key: string): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
  }
}

// Format utilities
export class FormatUtils {
  private constructor() {}

  public static formatTemperature(temp: number): string {
    return `${Math.round(temp)}°C`;
  }

  public static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  public static formatWindSpeed(speed: number): string {
    return `${Math.round(speed * 10) / 10} m/s`;
  }

  public static formatHumidity(humidity: number): string {
    return `${Math.round(humidity)}%`;
  }
}
