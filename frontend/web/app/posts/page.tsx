import { AuthGuard } from "../../components/AuthGuard";
import PostsPage from "../../views/pages/PostsPage";

export default function Posts() {
  return (
    <AuthGuard>
      <PostsPage />
    </AuthGuard>
  );
}
