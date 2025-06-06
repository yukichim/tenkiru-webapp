import { AuthGuard } from "../../components/AuthGuard";
import ProfilePage from "../../views/pages/ProfilePage";

export default function Profile() {
  return (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  );
}
