import { AuthGuard } from "../../components/AuthGuard";
import ClosetPage from "../../views/pages/ClosetPage";

export default function Closet() {
  return (
    <AuthGuard>
      <ClosetPage />
    </AuthGuard>
  );
}
