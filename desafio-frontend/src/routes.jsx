import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Orders from './pages/Orders';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const hasAuthCookie = document.cookie
    .split('; ')
    .some((cookie) => cookie.startsWith('auth_token='));

  return hasAuthCookie ? children : <Navigate to='/login' replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/orders' replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <Orders />
      </ProtectedRoute>
    ),
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
