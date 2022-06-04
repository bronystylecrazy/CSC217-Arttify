export type InfoResponse<T = any> = {
    status: boolean;
    data: T;
    message: string;
    code: number;
};