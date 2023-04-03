import axios from "axios";
import useAuth from "./useAuth";

export const useRefreshToken = () => {
  const { setAuth, auth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/api/refreshTokens", {
      withCredentials: true,
    });
    setAuth({
      ...auth,
      roles: response.data.roles,
      accessToken: response.data.accessToken,
    });
    return response.data.accessToken;
  };

  return refresh;
};
