const { useLocation, Outlet, Navigate } = require("react-router-dom");
const { default: useAuth } = require("../hooks/useAuth");

export const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  const isAuthorised = Object.values(auth.roles).some((role) =>
    allowedRoles.includes(role)
  );

  return isAuthorised ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/login" />
  );
};
