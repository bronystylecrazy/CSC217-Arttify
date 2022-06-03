import { Response } from 'express'

export const genericError = (message, code = 401) => {
    return {
        success: false,
        message,
        code,
    }
};

export function infoResponse<T = any>(message, data: T = null, code = 200) {
    return {
        success: true,
        message,
        data,
        code,
    }
}

export function info<T = any>(res: Response, message, data: T = null, code = 200) {
    return res.json(infoResponse(message, data, code));
}

export function error<T = any>(res: Response, message, code = 401) {
    return res.json(genericError(message, code));
}