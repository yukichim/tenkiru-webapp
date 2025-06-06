"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthController } from "../../controllers/AuthController";
import { LoginForm, RegisterForm } from "../../views/AuthComponents";
import { Layout } from "../../views/Common";

export default function LoginPageComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading, error } = useAuthController();
  const router = useRouter();

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    try {
      await login(credentials);
      router.push("/"); // ログイン成功時はホームページにリダイレクト
    } catch (error) {
      // エラーはAuthControllerで処理される
    }
  };

  const handleRegister = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    gender?: string;
    age?: number;
  }) => {
    if (data.password !== data.confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      await register({
        email: data.email,
        password: data.password,
        name: data.name,
        gender: data.gender,
        age: data.age,
      });
      router.push("/"); // 登録成功時はホームページにリダイレクト
    } catch (error) {
      // エラーはAuthControllerで処理される
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {isLogin ? (
            <LoginForm
              onSubmit={handleLogin}
              onSwitchToRegister={() => setIsLogin(false)}
              loading={isLoading}
              error={error}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              onSwitchToLogin={() => setIsLogin(true)}
              loading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
