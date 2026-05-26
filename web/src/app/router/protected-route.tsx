import { Navigate, useLocation } from 'react-router-dom';
import { useProfileQuery } from '@/entities/user';
import { ROUTES } from '@/shared/config/routes';
import { PageLoader } from '@/shared/ui/loader/page-loader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data, isPending, isError } = useProfileQuery();
  const loc = useLocation();
  if (isPending) return <PageLoader />;
  if (isError || !data) {
    return <Navigate to={ROUTES.login} state={{ from: loc.pathname }} replace />;
  }
  return <>{children}</>;
}
