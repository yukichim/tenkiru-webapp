import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UserPreferences,
} from "../types";

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "テストユーザー",
    email: "test@example.com",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      styles: ["casual"],
      colors: ["blue", "black"],
      preferredColors: ["blue", "black"],
      preferredBrands: ["Uniqlo"],
      style: "casual",
      notifications: true,
      temperatureUnit: "celsius",
      privacy: "public",
    },
  },
];

const MOCK_PASSWORD = "password";

export class MockUserModel {
  private constructor() {}

  public static async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find((u) => u.email === credentials.email);

    if (!user || credentials.password !== MOCK_PASSWORD) {
      throw new Error("メールアドレスまたはパスワードが正しくありません");
    }

    const response: AuthResponse = {
      user,
      token: `mock_token_${user.id}_${Date.now()}`,
    };

    return response;
  }

  public static async register(
    userData: RegisterRequest
  ): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user already exists
    if (MOCK_USERS.find((u) => u.email === userData.email)) {
      throw new Error("このメールアドレスは既に登録されています");
    }

    const newUser: User = {
      id: String(MOCK_USERS.length + 1),
      name: userData.name,
      email: userData.email,
      gender: userData.gender,
      age: userData.age,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        styles: [],
        colors: [],
        preferredColors: [],
        preferredBrands: [],
        style: "casual",
        notifications: true,
        temperatureUnit: "celsius",
        privacy: "public",
      },
    };

    MOCK_USERS.push(newUser);

    const response: AuthResponse = {
      user: newUser,
      token: `mock_token_${newUser.id}_${Date.now()}`,
    };

    return response;
  }

  public static async getProfile(): Promise<User> {
    // In a real app, this would validate the token and return the user
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_USERS[0]; // Return first user for testing
  }

  public static async getUserById(userId: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = MOCK_USERS.find((u) => u.id === userId);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }
    return user;
  }

  public static async updateProfile(userData: Partial<User>): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In a real app, this would update the user in the database
    const updatedUser = {
      ...MOCK_USERS[0],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    MOCK_USERS[0] = updatedUser;
    return updatedUser;
  }

  public static async updatePreferences(
    preferences: UserPreferences
  ): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const updatedUser = {
      ...MOCK_USERS[0],
      preferences,
      updatedAt: new Date().toISOString(),
    };
    MOCK_USERS[0] = updatedUser;
    return updatedUser;
  }

  public static logout(): void {
    // Clear any stored authentication data
    // This is handled by AuthUtils
  }

  public static getCurrentUser(): User | null {
    // This would typically validate the stored token
    // For now, return null to force login
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  public static isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;

    const token = document.cookie.includes("auth_token");
    const user = localStorage.getItem("user_data");
    return token && !!user;
  }
}
