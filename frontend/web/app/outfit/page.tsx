import { AuthGuard } from "../../components/AuthGuard";
import { OutfitPage } from "../../views/pages/OutfitPage";

export default function Outfit() {
  return (
    <AuthGuard>
      <OutfitPage />
    </AuthGuard>
  );
}
