import { info } from '@/utils/handler';
import { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import socketio from '@/socket';


const __PATH__ = './';

export const createIfNotExists = (p: string) => {
    if (!fs.existsSync(path.join(__PATH__, p))) {
        fs.mkdirSync(path.join(__PATH__, p));
    }
}

export const createUserWorkspace = (username: string) => {
    createIfNotExists('./user'); // mkdir ./user
    createIfNotExists(`./user/${username}`); // mkdir ./user/$(username)
};

/**
 {
    "clone_url": "",
    "token": ""
 }
 */
export const createBasedOnRepository = (req: Request, res: Response) => {
    if (!req.user) {
        throw "User not found!";
    }

    createUserWorkspace(req.user.username);

    console.log();

    const clone_url = req.body.clone_url;
    const token = req.user.token || "";

    if (!clone_url) {
        throw "Repository not found!";
    }

    const socket = socketio.getUser(req.user.id);
    socket.emit('message', 'created!');



    return info(res, "Successfully created!");
}