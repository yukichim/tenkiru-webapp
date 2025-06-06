import { useCallback, useEffect, useState } from "react";
import { UserModel } from "../models/UserModel";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  UserPreferences,
} from "../types";
import { apiClient } from "../utils/api-client";
import {
  AuthResponseSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
  UserSchema,
} from "../utils/schemas";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * 認証関連の操作を管理するコントローラー
 * @description ログイン、登録、ログアウト、プロフィール取得・更新を行う
 */
export class AuthController {
  private setState: (state: Partial<AuthState>) => void;

  constructor(setState: (state: Partial<AuthState>) => void) {
    this.setState = setState;
  }

  public async login(credentials: LoginRequest): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await UserModel.login(credentials);

      this.setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "ログインに失敗しました",
      });
      throw error;
    }
  }

  public async register(userData: RegisterRequest): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const response = await UserModel.register(userData);

      this.setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "アカウント作成に失敗しました",
      });
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      UserModel.logout();

      this.setState({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  public async getProfile(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const user = await UserModel.getProfile();

      this.setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "プロフィール取得に失敗しました",
      });
      throw error;
    }
  }

  public async updateProfile(userData: Partial<User>): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const updatedUser = await UserModel.updateProfile(userData);

      this.setState({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "プロフィール更新に失敗しました",
      });
      throw error;
    }
  }

  public async updatePreferences(preferences: UserPreferences): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const updatedUser = await UserModel.updatePreferences(preferences);

      this.setState({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "設定更新に失敗しました",
      });
      throw error;
    }
  }

  public initializeAuth(): void {
    const user = UserModel.getCurrentUser();
    const isAuthenticated = UserModel.isAuthenticated();

    this.setState({
      user,
      isAuthenticated,
      isLoading: false,
      error: null,
    });
  }

  public clearError(): void {
    this.setState({ error: null });
  }

  public async getUserById(userId: string): Promise<User | null> {
    try {
      this.setState({ isLoading: true, error: null });

      const user = await UserModel.getUserById(userId);

      this.setState({
        isLoading: false,
        error: null,
      });

      return user;
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "ユーザー情報の取得に失敗しました",
      });
      return null;
    }
  }

  // Zodスキーマを使用した型安全なAPIメソッド
  public async loginWithValidation(credentials: LoginRequest): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // リクエストデータのバリデーション
      const validatedCredentials = LoginRequestSchema.parse(credentials);

      // 型安全なAPIコール
      const response = await apiClient.safePost(
        "/auth/login",
        validatedCredentials,
        AuthResponseSchema,
        false // 認証前なのでauth headerは不要
      );

      this.setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error ? error.message : "ログインに失敗しました",
      });
      throw error;
    }
  }

  public async registerWithValidation(
    userData: RegisterRequest
  ): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // リクエストデータのバリデーション
      const validatedUserData = RegisterRequestSchema.parse(userData);

      // 型安全なAPIコール
      const response = await apiClient.safePost(
        "/auth/register",
        validatedUserData,
        AuthResponseSchema,
        false // 認証前なのでauth headerは不要
      );

      this.setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "アカウント作成に失敗しました",
      });
      throw error;
    }
  }

  public async getCurrentUserWithValidation(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      // 型安全なAPIコール
      const user = await apiClient.safeGet("/auth/me", UserSchema);

      this.setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, // ユーザー情報取得失敗はサイレントに処理
      });
    }
  }
}

// Hook for using AuthController
export const useAuthController = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const updateState = useCallback((newState: Partial<AuthState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  const controller = new AuthController(updateState);

  // Initialize auth on mount
  useEffect(() => {
    controller.initializeAuth();
  }, [controller]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login: controller.login.bind(controller),
    register: controller.register.bind(controller),
    logout: controller.logout.bind(controller),
    updateProfile: controller.updateProfile.bind(controller),
    getUserById: controller.getUserById.bind(controller),
    // 型安全なメソッド
    loginWithValidation: controller.loginWithValidation.bind(controller),
    registerWithValidation: controller.registerWithValidation.bind(controller),
    getCurrentUserWithValidation:
      controller.getCurrentUserWithValidation.bind(controller),
    controller,
  };
};
