import { info } from '@/utils/handler';
import { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import socketio from '@/socket';
import { Repository } from '@/databases/model';


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

export const updateRepositorySetting = async (req: Request, res: Response) => {
    if (!req.user) {
        throw "User not found!";
    }
    const repo_id = req.body.repo_id;
    const build_dir = req.body.build_dir;
    const build_cmd = req.body.build_cmd;
    const token = req.user.token || "";

    const repo = await Repository.findOneAndUpdate({
        id: repo_id,
    }, {
        build_cmd,
        build_dir,
        updated_at: new Date()
    });

    console.log(repo, repo_id);

    return info(res, "Successfully updated!", repo);
};

/**
 {
    "clone_url": "",
    "token": ""
 }
 */
export const createBasedOnRepository = async (req: Request, res: Response) => {
    if (!req.user) {
        throw "User not found!";
    }

    createUserWorkspace(req.user.username);

    const repo_id = req.body.repo_id;
    const clone_url = req.body.clone_url;
    const full_name = req.body.full_name;
    const name = req.body.name;
    const token = req.user.token || "";
    const user_id = req.user.id;


    if (!clone_url) {
        throw "Repository not found!";
    }

    let repo = await Repository.findOne({
        owner_id: user_id,
        id: repo_id
    });

    if (!repo) {
        repo = await Repository.create({
            id: repo_id,
            owner_id: user_id,
            clone_url,
            full_name,
            name,
            build_cmd: "npm run build",
            build_dir: "dist",
            created_at: new Date(),
            updated_at: new Date()
        });
    } else {

    }

    return info(res, "Successfully created!", repo);
}