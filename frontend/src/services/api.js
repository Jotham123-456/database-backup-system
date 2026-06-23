import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000",
});

export const runBackup = async () => {
    const res = await API.post("/backup");
    return res.data;
};

export const getStatus = async () => {
    const res = await API.get("/status");
    return res.data;
};

export const getDatabases = async () => {
  const res = await API.get("/databases");
  return res.data;
};

export const addDatabase = async (db) => {
  const res = await API.post("/databases", db);
  return res.data;
};

export const getHistory = async () => {

    const res =
        await API.get("/history");

    return res.data;

};