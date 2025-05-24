import axios from "axios";

const BASE_URL = "http://localhost:5000/api/groups";

export const fetchGroups = async (username) => {
  const res = await axios.get(BASE_URL, { headers: { username } });
  return res.data;
};

export const createGroup = async (group, username) => {
  const res = await axios.post(BASE_URL, group, { headers: { username } });
  return res.data;
};

export const joinGroup = async (groupId, username) => {
  const res = await axios.post(`${BASE_URL}/${groupId}/join`, {}, { headers: { username } });
  return res.data;
};

export const getGroupMembers = async (groupId, username) => {
  const res = await axios.get(`${BASE_URL}/${groupId}/members`, { headers: { username } });
  return res.data.members;
};
