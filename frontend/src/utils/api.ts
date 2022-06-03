import instance from "axios";

export const axios = instance.create({
    withCredentials: true,
    validateStatus: () => true,
});
