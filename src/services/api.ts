import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333/api", // ou "http://backend:3333" se estiver usando docker-compose
});
