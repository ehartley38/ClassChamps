import axios from "axios";
const baseUrl = "/api/assignments";

// Create an assignment
const create = async (jwt, newObject) => {
  const response = await axios.post(baseUrl, newObject, {
    headers: {
      authorization: "bearer " + jwt.token,
    },
  });
  return response.data;
};

// Get all assignments for a provided classroom
const getByClassroom = async (jwt, classroomId) => {
  const response = await axios.get(`${baseUrl}/classroom/${classroomId}`, {
    headers: {
      authorization: "bearer " + jwt.token,
    },
  });
  return response.data;
};

// Get all due assignments for a provided classroom
const getAllDueByClassroom = async (jwt, classroomId) => {
  const response = await axios.get(`${baseUrl}/classroom/${classroomId}/due`, {
    headers: {
      authorization: "bearer " + jwt.token,
    },
  });
  return response.data;
};

// Get leaderboard data for assignment
const getLeaderboardData = async (jwt, assignmentId) => {
  const response = await axios.get(`${baseUrl}/leaderboard/${assignmentId}`, {
    headers: {
      authorization: "bearer " + jwt.token,
    },
  });
  return response.data;
};

export default {
  create,
  getByClassroom,
  getLeaderboardData,
  getAllDueByClassroom,
};
