import Cookies from "js-cookie";
import type { z } from "zod";
import { validateApiResponse } from "./schemas";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getAuthToken(): string | null {
    return Cookies.get("auth_token") || null;
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response, schema?: z.ZodType<T>): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    let responseData: unknown;
    
    if (contentType || contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Zodスキーマが提供されている場合、バリデーションを実行
    if (schema) {
      return validateApiResponse(schema, responseData);
    }

    return responseData as T;
  }

  public async get<T>(endpoint: string, includeAuth = true, schema?: z.ZodType<T>): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response, schema);
  }

  public async post<T>(
    endpoint: string,
    data: Record<string, unknown>,
    includeAuth = true,
    schema?: z.ZodType<T>
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response, schema);
  }

  public async put<T>(
    endpoint: string,
    data: Record<string, unknown>,
    includeAuth = true,
    schema?: z.ZodType<T>
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response, schema);
  }

  public async delete<T>(endpoint: string, includeAuth = true, schema?: z.ZodType<T>): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(includeAuth),
    });

    return this.handleResponse<T>(response, schema);
  }

  // Zodスキーマを使用した型安全なAPIメソッド
  public async safeGet<T>(endpoint: string, schema: z.ZodType<T>, includeAuth = true): Promise<T> {
    return this.get(endpoint, includeAuth, schema);
  }

  public async safePost<T>(
    endpoint: string,
    data: Record<string, unknown>,
    schema: z.ZodType<T>,
    includeAuth = true
  ): Promise<T> {
    return this.post(endpoint, data, includeAuth, schema);
  }

  public async safePut<T>(
    endpoint: string,
    data: Record<string, unknown>,
    schema: z.ZodType<T>,
    includeAuth = true
  ): Promise<T> {
    return this.put(endpoint, data, includeAuth, schema);
  }

  public async safeDelete<T>(endpoint: string, schema: z.ZodType<T>, includeAuth = true): Promise<T> {
    return this.delete(endpoint, includeAuth, schema);
  }

  // バッチリクエスト用のメソッド
  public async batchRequest<T>(
    requests: Array<{
      endpoint: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: Record<string, unknown>;
      schema?: z.ZodType<T>;
    }>
  ): Promise<T[]> {
    const promises = requests.map(async (request) => {
      switch (request.method) {
        case 'GET':
          return this.get(request.endpoint, true, request.schema);
        case 'POST':
          return this.post(request.endpoint, request.data || {}, true, request.schema);
        case 'PUT':
          return this.put(request.endpoint, request.data || {}, true, request.schema);
        case 'DELETE':
          return this.delete(request.endpoint, true, request.schema);
        default:
          throw new Error(`Unsupported method: ${request.method}`);
      }
    });

    return Promise.all(promises);
  }
}

export const apiClient = ApiClient.getInstance();
