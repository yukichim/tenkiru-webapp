import { AuthGuard } from "../../components/AuthGuard";
import WeatherPage from "../../views/pages/WeatherPage";

export default function Weather() {
  return (
    <AuthGuard requireAuth={false}>
      <WeatherPage />
    </AuthGuard>
  );
}
