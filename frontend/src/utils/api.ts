import instance from "axios";

export const axios = instance.create({
    baseURL: "https://arttify.devsirawit.com",
    withCredentials: true,
    validateStatus: () => true,
});
