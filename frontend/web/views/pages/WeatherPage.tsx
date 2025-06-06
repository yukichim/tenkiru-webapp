"use client";

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { useFashionController } from "../../controllers/FashionController";
import { useLocationController } from "../../controllers/LocationController";
import { useWeatherController } from "../../controllers/WeatherController";
import type { Location } from "../../types";
import { Card, Layout, LoadingSpinner } from "../Common";
import {
  WeatherAlert,
  WeatherCard,
  WeatherClothingAdvice,
  WeatherForecast,
} from "../WeatherComponents";

interface WeatherPageProps {
  initialLocation?: Location;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({
  initialLocation,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocation || null
  );
  const [showLocationSearch, setShowLocationSearch] = useState(
    !initialLocation
  );

  const {
    currentWeather,
    forecast,
    alerts,
    isLoading: weatherLoading,
    error: weatherError,
    refreshWeather,
    getWeatherByLocation,
  } = useWeatherController();

  const {
    locations,
    isLoading: locationLoading,
    searchLocations,
    addFavoriteLocation,
    removeFavoriteLocation,
  } = useLocationController();

  const {
    recommendations,
    isLoading: fashionLoading,
    getRecommendations,
  } = useFashionController();

  useEffect(() => {
    if (selectedLocation) {
      getWeatherByLocation(selectedLocation);
      getRecommendations(selectedLocation);
    }
  }, [selectedLocation, getWeatherByLocation, getRecommendations]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationSearch(false);
  };

  const handleLocationChange = () => {
    setShowLocationSearch(true);
  };

  const handleAddToFavorites = async () => {
    if (selectedLocation) {
      await addFavoriteLocation(selectedLocation);
    }
  };

  const isLoading = weatherLoading || locationLoading || fashionLoading;
  const error = weatherError;

  return (
    <Layout>
      <div className="weather-page">
        <div className="weather-page__header">
          <h1 className="weather-page__title">天気予報</h1>
          {selectedLocation && (
            <div className="weather-page__location">
              <span>{selectedLocation.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLocationChange}
              >
                場所を変更
              </Button>
            </div>
          )}
        </div>

        {showLocationSearch && (
          <Card className="weather-page__location-search">
            <h3>場所を選択</h3>
            <div className="location-search">
              <input
                type="text"
                placeholder="都市名を入力..."
                onChange={(e) => searchLocations(e.target.value)}
                className="location-search__input"
              />
              <div className="location-search__results">
                {locations.map((location) => (
                  <Button
                    key={`${location.lat}-${location.lon}`}
                    className="location-search__result"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location.name}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {isLoading && <LoadingSpinner />}
        {error && (
          <Card className="weather-page__error">
            <p className="error-message">{error}</p>
          </Card>
        )}

        {currentWeather && selectedLocation && (
          <div className="weather-page__content">
            {/* Current Weather */}
            <section className="weather-page__current">
              <WeatherCard
                weather={currentWeather}
                location={selectedLocation.name}
                showDetails={true}
              />
            </section>

            {/* Weather Alerts */}
            {alerts && alerts.length > 0 && (
              <section className="weather-page__alerts">
                <h2>気象警報</h2>
                <WeatherAlert alerts={alerts} />
              </section>
            )}

            {/* Forecast */}
            {forecast?.daily && (
              <section className="weather-page__forecast">
                <h2>5日間予報</h2>
                <WeatherForecast forecasts={forecast.daily} />
              </section>
            )}

            {/* Clothing Advice */}
            {recommendations && (
              <section className="weather-page__clothing-advice">
                <h2>今日の服装アドバイス</h2>
                <WeatherClothingAdvice weather={currentWeather} />
              </section>
            )}

            {/* Weather Map */}
            <section className="weather-page__map">
              <Card>
                <h3>天気マップ</h3>
                <div className="weather-map">
                  <p>天気マップ機能は開発中です</p>
                  {/* TODO: Integrate weather map API */}
                </div>
              </Card>
            </section>
          </div>
        )}
      </div>

      <style jsx>{`
        .weather-page {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .weather-page__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .weather-page__title {
          font-size: 2rem;
          font-weight: bold;
          margin: 0;
        }

        .weather-page__location {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
        }

        .weather-page__location-search {
          margin-bottom: 20px;
        }

        .location-search__input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        .location-search__results {
          max-height: 200px;
          overflow-y: auto;
        }

        .location-search__result {
          display: block;
          width: 100%;
          padding: 10px;
          text-align: left;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 1px solid #eee;
        }

        .location-search__result:hover {
          background-color: #f5f5f5;
        }

        .weather-page__content {
          display: grid;
          gap: 20px;
        }

        .weather-page__current {
          grid-column: 1 / -1;
        }

        .weather-page__alerts {
          grid-column: 1 / -1;
        }

        .weather-page__forecast {
          grid-column: 1 / -1;
        }

        .weather-page__clothing-advice {
          grid-column: 1 / -1;
        }

        .weather-page__map {
          grid-column: 1 / -1;
        }

        .weather-map {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          border-radius: 5px;
        }

        .weather-page__error {
          margin-bottom: 20px;
        }

        .error-message {
          color: #e53e3e;
          font-weight: 500;
        }

        @media (min-width: 768px) {
          .weather-page__content {
            grid-template-columns: 2fr 1fr;
          }

          .weather-page__clothing-advice {
            grid-column: 2;
            grid-row: 1 / 3;
          }
        }
      `}</style>
    </Layout>
  );
};

export default WeatherPage;
