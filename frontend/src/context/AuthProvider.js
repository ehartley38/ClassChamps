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

const AuthContext = createContext({
  user: undefined,
  jwt: undefined,
  recentBadges: undefined,
  login: (username, password) => {},
  signUp: (username, password, name) => {},
  signOut: () => {},
});

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

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  // Fetches the user details whenever the jwt changes
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const fetchedJwt = window.localStorage.getItem("loggedAppUser");
  //       if (jwt) {
  //         const fetchedUser = await usersService.getUserDetails(jwt);
  //         setUser(fetchedUser);
  //       } else if (fetchedJwt && jwt === undefined) {
  //         setJwt(JSON.parse(fetchedJwt));
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoadingInitial(false);
  //     }
  //   };
  //   fetchUser();
  // }, [jwt]);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     console.log("Fetching user details");
  //     //const fetchedUser = await usersService.getUserDetails();
  //     const response = await axiosPrivate.get(`/api/users/id`);
  //     console.log(response.data);
  //     //setUser(response.data);
  //   };
  //   fetchUserDetails();
  // }, [auth, axiosPrivate]);

  const login = async (username, password) => {
    // try {
    //   const response = await loginService.login({ username, password });
    //   const accessToken = response?.accessToken;
    //   const roles = response?.roles;
    //   console.log(response);
    //   setAuth({ username, password, roles, accessToken });
    // } catch (err) {
    //   setError(err.data);
    // } finally {
    //   setLoading(false);
    // }
  };

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

  const signOut = () => {
    window.localStorage.removeItem("loggedAppUser");
    setJwt(undefined);
    setUser(undefined);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signUp,
        signOut,
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
