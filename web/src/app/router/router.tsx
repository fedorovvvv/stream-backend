import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/app-layout';
import { AuthLayout } from '@/app/layouts/auth-layout';
import { ProtectedRoute } from './protected-route';
import { ROUTES } from '@/shared/config/routes';
import { PageLoader } from '@/shared/ui/loader/page-loader';

// React.lazy + Vite code-splitting: each page becomes its own chunk so the
// initial bundle stays small. Named exports need this `.then` mapping.
const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));
const BrowsePage = lazy(() => import('@/pages/browse').then((m) => ({ default: m.BrowsePage })));
const CategoryPage = lazy(() =>
  import('@/pages/category').then((m) => ({ default: m.CategoryPage })),
);
const ChannelPage = lazy(() =>
  import('@/pages/channel').then((m) => ({ default: m.ChannelPage })),
);
const StreamPage = lazy(() => import('@/pages/stream').then((m) => ({ default: m.StreamPage })));
const DashboardOverviewPage = lazy(() =>
  import('@/pages/dashboard').then((m) => ({ default: m.DashboardOverviewPage })),
);
const DashboardSponsorshipPage = lazy(() =>
  import('@/pages/dashboard').then((m) => ({ default: m.DashboardSponsorshipPage })),
);
const DashboardSubscribersPage = lazy(() =>
  import('@/pages/dashboard').then((m) => ({ default: m.DashboardSubscribersPage })),
);
const DashboardChatPage = lazy(() =>
  import('@/pages/dashboard').then((m) => ({ default: m.DashboardChatPage })),
);
const SettingsLayoutPage = lazy(() =>
  import('@/pages/settings').then((m) => ({ default: m.SettingsLayoutPage })),
);
const LoginPage = lazy(() =>
  import('@/pages/auth-login').then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/pages/auth-register').then((m) => ({ default: m.RegisterPage })),
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/auth-reset-password').then((m) => ({ default: m.ResetPasswordPage })),
);
const NewPasswordPage = lazy(() =>
  import('@/pages/auth-new-password').then((m) => ({ default: m.NewPasswordPage })),
);
const VerifyAccountPage = lazy(() =>
  import('@/pages/auth-verify-account').then((m) => ({ default: m.VerifyAccountPage })),
);
const DeactivatePage = lazy(() =>
  import('@/pages/auth-deactivate').then((m) => ({ default: m.DeactivatePage })),
);
const NotificationsPage = lazy(() =>
  import('@/pages/notifications').then((m) => ({ default: m.NotificationsPage })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })),
);

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      { path: ROUTES.home, element: <S><HomePage /></S> },
      { path: ROUTES.browse, element: <S><BrowsePage /></S> },
      { path: ROUTES.categoryPattern, element: <S><CategoryPage /></S> },
      { path: ROUTES.channelPattern, element: <S><ChannelPage /></S> },
      { path: ROUTES.streamPattern, element: <S><StreamPage /></S> },
      {
        path: ROUTES.dashboard,
        element: (
          <ProtectedRoute>
            <S>
              <DashboardOverviewPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.dashboardSponsorship,
        element: (
          <ProtectedRoute>
            <S>
              <DashboardSponsorshipPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.dashboardSubscribers,
        element: (
          <ProtectedRoute>
            <S>
              <DashboardSubscribersPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.dashboardChat,
        element: (
          <ProtectedRoute>
            <S>
              <DashboardChatPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.settings,
        element: (
          <ProtectedRoute>
            <S>
              <SettingsLayoutPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.settingsSessions,
        element: (
          <ProtectedRoute>
            <S>
              <SettingsLayoutPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.settingsTransactions,
        element: (
          <ProtectedRoute>
            <S>
              <SettingsLayoutPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings/followings',
        element: (
          <ProtectedRoute>
            <S>
              <SettingsLayoutPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.notifications,
        element: (
          <ProtectedRoute>
            <S>
              <NotificationsPage />
            </S>
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.deactivate,
        element: (
          <ProtectedRoute>
            <S>
              <DeactivatePage />
            </S>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      { path: ROUTES.login, element: <S><LoginPage /></S> },
      { path: ROUTES.register, element: <S><RegisterPage /></S> },
      { path: ROUTES.resetPassword, element: <S><ResetPasswordPage /></S> },
      { path: ROUTES.newPassword, element: <S><NewPasswordPage /></S> },
      { path: ROUTES.verifyAccount, element: <S><VerifyAccountPage /></S> },
    ],
  },
  { path: '*', element: <S><NotFoundPage /></S> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
