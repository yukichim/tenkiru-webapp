import { z } from "zod";

// User schemas
export const UserPreferencesSchema = z.object({
  styles: z.array(z.string()),
  colors: z.array(z.string()),
  preferredColors: z.array(z.string()),
  preferredBrands: z.array(z.string()),
  style: z.string(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  gender: z.string().optional(),
  age: z.number().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  preferences: UserPreferencesSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Auth schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const RegisterRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.string().optional(),
  age: z.number().optional(),
});

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

// Weather schemas
export const WeatherConditionSchema = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  description: z.string(),
  windDirection: z.number(),
  visibility: z.number(),
  uvIndex: z.number(),
  condition: z.string(),
  humidity: z.number(),
  windSpeed: z.number(),
  cloudCover: z.number(),
  location: z.string(),
  dateTime: z.string(),
  pressure: z.number(),
});

export const WeatherAlertSchema = z.object({
  type: z.enum(["warning", "watch", "advisory"]),
  title: z.string(),
  description: z.string(),
  severity: z.enum(["low", "medium", "high"]),
});

export const WeatherForecastSchema = z.object({
  location: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  daily: z.array(
    WeatherConditionSchema.extend({
      date: z.string(),
    })
  ),
  hourly: z.array(WeatherConditionSchema),
  lastUpdated: z.string(),
});

// Clothing schemas
export const ClothingItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  color: z.string(),
  size: z.string(),
  season: z.array(z.string()),
  description: z.string().optional(),
  category: z.string(),
  brand: z.string(),
  warmthLevel: z.number(),
  imageUrl: z.string(),
  createdAt: z.string(),
});

export const CreateClothingRequestSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  color: z.string().min(1),
  brand: z.string().min(1),
  imageUrl: z.string().url(),
  warmthLevel: z.number().min(0).max(10),
});

// Fashion schemas
export const RecommendedItemSchema = z.object({
  category: z.string(),
  name: z.string(),
  color: z.string(),
  reason: z.string(),
});

export const FashionRecommendationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  style: z.string(),
  items: z.array(RecommendedItemSchema),
  weather: WeatherConditionSchema,
  reason: z.string(),
  location: z.string(),
  createdAt: z.string(),
});

export const RecommendationRequestSchema = z.object({
  userId: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  location: z.string(),
});

// Outfit schemas
export const OutfitPostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  title: z.string(),
  items: z.array(z.string()),
  description: z.string(),
  tags: z.array(z.string()),
  weather: WeatherConditionSchema,
  temperature: z.number(),
  location: z.string(),
  imageUrl: z.string(),
  createdAt: z.string(),
  likes: z.number(),
});

export const CreateOutfitPostRequestSchema = z.object({
  items: z.array(z.string()),
  description: z.string(),
  tags: z.array(z.string()),
  weather: WeatherConditionSchema,
  temperature: z.number(),
  location: z.string(),
  imageUrl: z.string().url(),
});

// API Response schemas
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

// Location schema
export const LocationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  name: z.string(),
});

// Common validation functions
export const validateApiResponse = <T>(
  schema: z.ZodType<T>,
  data: unknown
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
};

export const safeValidateApiResponse = <T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation failed: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown validation error",
    };
  }
};
