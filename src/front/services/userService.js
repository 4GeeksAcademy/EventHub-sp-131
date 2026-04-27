const API_URL = import.meta.env.VITE_BACKEND_URL || "";

const getToken = () => localStorage.getItem("token");

export const registerUser = (data) => {
  return fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};

export const loginUser = (data) => {
  return fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};

export const getPrivateUser = () => {
  return fetch(`${API_URL}/api/user/private`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  }).then((res) => res.json());
};

export const getEvents = () => {
  return fetch(`${API_URL}/api/events`).then((res) => res.json());
};

export const getEventById = (id) => {
  return fetch(`${API_URL}/api/events/${id}`).then((res) => res.json());
};

export const saveEvent = (data) => {
  return fetch(`${API_URL}/api/saved_event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};

export const getSavedEvents = () => {
  return fetch(`${API_URL}/api/saved_event`).then((res) => res.json());
};

export const assistEvent = (data) => {
  return fetch(`${API_URL}/api/event-assists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};

export const getEventAssists = () => {
  return fetch(`${API_URL}/api/event-assists`)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al obtener asistencias");
      }
      return res.json();
    });
};

export const getComments = () => {
  return fetch(`${API_URL}/api/comments`).then((res) => res.json());
};

export const createComment = (data) => {
  return fetch(`${API_URL}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};

export const getGroups = () => {
  return fetch(`${API_URL}/api/group`).then((res) => res.json());
};

export const getGroupById = (id) => {
  return fetch(`${API_URL}/api/group/${id}`).then((res) => res.json());
};

export const createGroup = (data) => {
  return fetch(`${API_URL}/api/group`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};

export const joinGroup = (data) => {
  return fetch(`${API_URL}/api/discussion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};

export const getUsers = () => {
  return fetch(`${API_URL}/api/users`).then((res) => res.json());
};

export const getUserById = (id) => {
  return fetch(`${API_URL}/api/users/${id}`).then((res) => res.json());
};

export const addFriend = (data) => {
  return fetch(`${API_URL}/api/friend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then((res) => res.json());
};