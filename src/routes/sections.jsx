import { lazy, Suspense } from 'react';
import { Outlet, useRoutes, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

import DashboardLayout from 'src/layouts/dashboard';
import { Paiements } from 'src/sections/paiements/view';
import PaymentManager from 'src/sections/paiements/view/PaymentManager';

// Lazy imports des pages
export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const UserCreate = lazy(() => import('src/pages/user-create'));
export const UserUpdate = lazy(() => import('src/pages/user-update'));
export const AbsencePage = lazy(() => import('src/pages/absence'));
export const AbsencesConsultationPage = lazy(() => import('src/pages/absences-consultation'));

export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%', // Adjust this if you want a specific height
    }}><span class="loader" ></span> <br /> Chargement</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={<div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%', // Adjust this if you want a specific height
            }}><span class="loader" ></span> <br /> Chargement</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'user-create', element: <UserCreate /> },
        { path: 'paiements', element: <PaymentManager /> },
        { path: 'user-update/:userId', element: <UserUpdate /> },
        { path: 'absence', element: <AbsencePage /> },
        { path: 'absences-consultation', element: <AbsencesConsultationPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}