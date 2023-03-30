import loginService from "../services/login";
import usersService from "../services/users";
const { createContext, useState, useEffect } = require("react");

const AuthContext = createContext({
  login: (username, password) => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(undefined);
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (auth !== undefined) {
        const userData = await usersService.getUserDetails(auth.jwt);
        setUserDetails(userData);
      }
    };
    fetchUserDetails();
  }, [auth]);

  const login = async (username, password) => {
    const roles = { Student: 2001, Teacher: 3001 }; //Hardcode for now
    const jwt = await loginService.login({ username, password });
    window.localStorage.setItem("loggedAppUser", JSON.stringify(jwt));
    setAuth({ username, password, roles, jwt });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
