import instance from "axios";

const baseURL = location.hostname !== "127.0.0.1" && `https://arttify.devsirawit.com`;

export const axios = instance.create({
    baseURL,
    withCredentials: true,
    validateStatus: () => true,
});
