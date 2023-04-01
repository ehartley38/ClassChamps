import useAxiosPrivate from "../hooks/useAxiosPrivate";

const baseUrl = "/api/users";

// const setToken = (newToken) => {
//   token = `bearer ${newToken}`;
// };

const signUp = async (credentials) => {
  // const response = await useAxiosPrivate.post(baseUrl, credentials, {
  //   headers: { "Content-Type": "application/json" },
  //   withCredentials: true,
  // });
  //const response = await axiosPrivate.get();
  // return response.data;
};

const getUserDetails = async (jwt) => {
  // const request = await useAxiosPrivate.get(baseUrl + "/id", {
  //   headers: {
  //     authorization: "bearer " + jwt,
  //   },
  // });

  const request = await useAxiosPrivate.get(`${baseUrl}/id`);
  return request.data;
};

export default { signUp, getUserDetails };
