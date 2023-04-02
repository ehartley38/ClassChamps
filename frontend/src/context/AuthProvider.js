import React, {
  useState,
  createContext,
  useEffect,
  useMemo,
  useContext,
} from "react";
import usersService from "../services/users";
import loginService from "../services/login";
import { useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [jwt, setJwt] = useState(undefined);
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const [recentBadges, setRecentBadges] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const axiosPrivate = useAxiosPrivate();

  const signUp = async (username, password, name) => {
    setLoading(true);

    try {
      const generatedJwt = await usersService.signUp({
        username,
        password,
        name,
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signUp,
        jwt,
        loading,
        error,
        recentBadges,
        setRecentBadges,
        auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
