import $ from "jquery";

const BASE_URL = "http://localhost:5000/api/groups";

export const fetchGroups = async (username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: BASE_URL,
      method: "GET",
      headers: { username },
      success: resolve,
      error: reject
    });
  });
};

export const createGroup = async (group, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: BASE_URL,
      method: "POST",
      headers: { username },
      data: JSON.stringify(group),
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const joinGroup = async (groupId, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/${groupId}/join`,
      method: "POST",
      headers: { username },
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const getGroupMembers = async (groupId, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/${groupId}/members`,
      method: "GET",
      headers: { username },
      success: (data) => resolve(data.members),
      error: reject
    });
  });
};

export const approveMember = async (groupId, userToApprove, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/${groupId}/approve`,
      method: "POST",
      headers: { username },
      data: JSON.stringify({ userToApprove }),
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const removeMember = async (groupId, userToRemove, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/${groupId}/remove`,
      method: "POST",
      headers: { username },
      data: JSON.stringify({ userToRemove }),
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const leaveGroup = async (groupId, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/${groupId}/leave`,
      method: "POST",
      headers: { username },
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const transferAdminAndLeave = async (groupId, newAdmin, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/${groupId}/transfer-admin`,
      method: "PUT",
      headers: { username },
      data: JSON.stringify({ newAdmin }),
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const deleteGroup = async (groupId, username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/${groupId}`,
      method: "DELETE",
      headers: { username },
      contentType: "application/json",
      success: resolve,
      error: reject
    });
  });
};

export const fetchUserGroups = async (username) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `${BASE_URL}/my`,
      method: "GET",
      headers: { username },
      success: resolve,
      error: reject
    });
  });
};
