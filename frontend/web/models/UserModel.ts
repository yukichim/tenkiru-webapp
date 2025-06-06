import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserPreferences,
} from "../types";
import { apiClient } from "../utils/api-client";
import { AuthUtils } from "../utils/helpers";

export class UserModel {
  private constructor() {}
  public static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/login",
        credentials as unknown as Record<string, unknown>,
        false
      );

      // Store authentication data
      AuthUtils.setToken(response.token);
      AuthUtils.setUser(response.user);

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  /**
   * ユーザー登録
   */
  public static async register(
    userData: RegisterRequest
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        "/register",
        userData as unknown as Record<string, unknown>,
        false
      );

      // Store authentication data
      AuthUtils.setToken(response.token);
      AuthUtils.setUser(response.user);

      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  /**
   * ユーザー情報取得
   */
  public static async getProfile(): Promise<User> {
    try {
      return await apiClient.get<User>("/profile");
    } catch (error) {
      console.error("Failed to get profile:", error);
      throw error;
    }
  }

  /**
   * ユーザーIDでユーザー情報を取得
   */
  public static async getUserById(userId: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/users/${userId}`);
    } catch (error) {
      console.error("Failed to get user by ID:", error);
      throw error;
    }
  }

  /**
   * ユーザープロフィールを更新
   */
  public static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      return await apiClient.put<User>(
        "/profile",
        userData as unknown as Record<string, unknown>
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  }

  /**
   * ユーザーの設定を更新
   */
  public static async updatePreferences(
    preferences: UserPreferences
  ): Promise<User> {
    try {
      return await apiClient.put<User>(
        "/profile/preferences",
        preferences as unknown as Record<string, unknown>
      );
    } catch (error) {
      console.error("Failed to update preferences:", error);
      throw error;
    }
  }

  public static logout(): void {
    AuthUtils.logout();
  }

  public static getCurrentUser(): User | null {
    return AuthUtils.getUser();
  }

  public static isAuthenticated(): boolean {
    return AuthUtils.isAuthenticated();
  }
}
