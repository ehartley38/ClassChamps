import React, { useState, createContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [persist, setPersist] = useState(
    JSON.parse(localStorage.getItem("persist")) || false
  );

  const [recentBadges, setRecentBadges] = useState([]);

  return (
    <AuthContext.Provider
      value={{
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
