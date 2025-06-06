"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";

interface WeatherCardProps {
  date: string;
  weather: string;
  minTemp?: string;
  maxTemp?: string;
  icon: LucideIcon;
  imageUrl?: string;
}

export default function WeatherCard({
  date,
  weather,
  minTemp,
  maxTemp,
  icon: Icon,
  imageUrl,
}: WeatherCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Icon className="w-8 h-8 text-blue-500" />
          <div>
            <h3 className="font-semibold text-lg">{date}</h3>
            <p className="text-gray-600">{weather}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {imageUrl && (
            <div className="w-16 h-16 relative">
              <Image
                src={imageUrl}
                alt={weather}
                fill
                className="object-contain"
              />
            </div>
          )}

          <div className="text-right">
            {maxTemp && (
              <div className="text-xl font-semibold text-red-500">
                {maxTemp}°C
              </div>
            )}
            {minTemp && (
              <div className="text-sm text-blue-500">{minTemp}°C</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
