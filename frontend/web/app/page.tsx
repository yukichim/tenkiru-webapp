import { AuthGuard } from "../components/AuthGuard";
import HomePage from "../views/pages/HomePage";

export default function Home() {
  return (
    <AuthGuard requireAuth={true}>
      <HomePage />
    </AuthGuard>
  );
}
