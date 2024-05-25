import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
});

export const createRooom = (roomId,owner) =>
  apiClient.post(`/room`,{roomId,owner});

export const getRoom = (roomId) =>
  apiClient.get(`/room/${roomId}`);

export const addMember = (roomId,member) =>
  apiClient.put(`room/add/${roomId}`,{member});

export const deleteMember = (roomId,member) =>
  apiClient.put(`room/remove/${roomId}`,{member});