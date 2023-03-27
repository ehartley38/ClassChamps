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

const AuthContext = createContext({
  user: undefined,
  jwt: undefined,
  login: (username, password) => {},
  signUp: (username, password, name) => {},
  signOut: () => {},
});

//https://dev.to/finiam/predictable-react-authentication-with-the-context-api-g10

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [jwt, setJwt] = useState(undefined);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const location = useLocation();

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  // Fetches the user details whenever the jwt changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedJwt = window.localStorage.getItem("loggedAppUser");
        if (jwt) {
          setLoading(true);
          const fetchedUser = await usersService.getUserDetails(jwt);
          setUser(fetchedUser);
        } else if (fetchedJwt && jwt === undefined) {
          setJwt(JSON.parse(fetchedJwt));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingInitial(false);
        setLoading(false);
      }
    };
    fetchUser();
  }, [jwt]);

  const login = async (username, password) => {
    setLoading(true);

    try {
      const generatedJwt = await loginService.login({ username, password });
      window.localStorage.setItem(
        "loggedAppUser",
        JSON.stringify(generatedJwt)
      );

      // GeneratedJwt returns a Json Object, hence why it is set to the jwt directly without any parsing
      setJwt(generatedJwt);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
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
    console.log("signout");
    window.localStorage.removeItem("loggedAppUser");
    setJwt(undefined);
    setUser(undefined);
  };

  /*
    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            error,
            login,
            signUp,
            signOut,
            jwt
        }),
        [user, loading, error, jwt]
    );
    */

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
        loadingInitial,
      }}
    >
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
