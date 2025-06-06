import { useState, useCallback } from "react";
import type { Location } from "../types";
import { LocationUtils } from "../utils/helpers";

interface UseLocationControllerReturn {
	locations: Location[];
	favorites: Location[];
	currentLocation: Location | null;
	isLoading: boolean;
	error: string | null;
	searchLocations: (query: string) => Promise<void>;
	getCurrentLocation: () => Promise<void>;
	addFavoriteLocation: (location: Location) => Promise<void>;
	removeFavoriteLocation: (location: Location) => Promise<void>;
	getFavoriteLocations: () => Promise<void>;
}

export const useLocationController = (): UseLocationControllerReturn => {
	const [locations, setLocations] = useState<Location[]>([]);
	const [favorites, setFavorites] = useState<Location[]>([]);
	const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const searchLocations = useCallback(async (query: string) => {
		if (!query.trim()) {
			setLocations([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			// Mock search results - in real app, this would call a geocoding API
			const mockResults: Location[] = [
				{
					name: `${query} - 東京都`,
					lat: 35.6762 + Math.random() * 0.1,
					lon: 139.6503 + Math.random() * 0.1,
					country: "Japan",
					state: "東京都",
				},
				{
					name: `${query} - 大阪府`,
					lat: 34.6937 + Math.random() * 0.1,
					lon: 135.5023 + Math.random() * 0.1,
					country: "Japan",
					state: "大阪府",
				},
				{
					name: `${query} - 愛知県`,
					lat: 35.1815 + Math.random() * 0.1,
					lon: 136.9066 + Math.random() * 0.1,
					country: "Japan",
					state: "愛知県",
				},
			].filter(
				(loc) =>
					loc.name.toLowerCase().includes(query.toLowerCase()) ||
					loc.state.includes(query),
			);

			setLocations(mockResults);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "位置情報の検索に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getCurrentLocation = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const position = await LocationUtils.getCurrentLocation();
			const location: Location = {
				name: "現在地",
				lat: position.coords.latitude,
				lon: position.coords.longitude,
			};
			setCurrentLocation(location);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "現在地の取得に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const addFavoriteLocation = useCallback(
		async (location: Location) => {
			setIsLoading(true);
			setError(null);

			try {
				const updatedFavorites = [...favorites, location];
				setFavorites(updatedFavorites);

				// Save to localStorage
				localStorage.setItem(
					"favoriteLocations",
					JSON.stringify(updatedFavorites),
				);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "お気に入りの追加に失敗しました",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[favorites],
	);

	const removeFavoriteLocation = useCallback(
		async (location: Location) => {
			setIsLoading(true);
			setError(null);

			try {
				const updatedFavorites = favorites.filter(
					(fav) => !(fav.lat === location.lat && fav.lon === location.lon),
				);
				setFavorites(updatedFavorites);

				// Save to localStorage
				localStorage.setItem(
					"favoriteLocations",
					JSON.stringify(updatedFavorites),
				);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "お気に入りの削除に失敗しました",
				);
			} finally {
				setIsLoading(false);
			}
		},
		[favorites],
	);

	const getFavoriteLocations = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const saved = localStorage.getItem("favoriteLocations");
			if (saved) {
				const favoriteLocations: Location[] = JSON.parse(saved);
				setFavorites(favoriteLocations);
			}
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "お気に入りの読み込みに失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		locations,
		favorites,
		currentLocation,
		isLoading,
		error,
		searchLocations,
		getCurrentLocation,
		addFavoriteLocation,
		removeFavoriteLocation,
		getFavoriteLocations,
	};
};
