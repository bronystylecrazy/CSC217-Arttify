import * as chalk from "chalk";

/** Internal Modules */
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import jwt from "express-jwt";
import jsonwebtoken from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import socketioServer from 'socket.io';

/** Routes */
import authRoute from "@/routes/auth";
import repoRoute from "@/routes/repo";

/** Misc */
import config from "./config";

/** logger */
import fs from "fs";
import path from "path";
import { logger } from "@/utils/serviceLog";
import AppConfig from "./config";
import { User } from "./databases/model";
import socketio from "./socket";
import { spawn } from "child_process";

/** Instantiate Application */
const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, "access.log"),
    {
        flags: "a",
    }
);

/** Express configurations */
app.use(express.json());

if (AppConfig.APP_LOG === "true") {
    app.use(
        config.isDev
            ? morgan("combined")
            : morgan("combined", { stream: accessLogStream })
    );
}

app.use(express.urlencoded({ extended: true }));

/** Plugins */
app.use(
    cors({
        origin: "http://127.0.0.1:5377"
    })
);

app.use(cookieParser());

/** Json Web Token */
app.use(
    jwt({
        secret: config.JWT_SECRET,
        algorithms: ["HS256"],
        credentialsRequired: false,
        getToken: function fromHeaderOrQuerystring(req) {
            if (
                req.headers.authorization &&
                req.headers.authorization.split(" ")[0] === "Bearer"
            ) {
                return req.headers.authorization.split(" ")[1];
            } else if (req.query && req.query.user) {
                return req.query.user;
            } else if (req.cookies.user) {
                return req.cookies.user;
            }
            return null;
        },
    })
);

const api = express.Router();

/** Routes */
api.use("/auth", authRoute);
api.use("/repo", repoRoute);
// app.use("/storage", storageRoute);
/** protected Routes */
// app.use("/event", eventRoute);
// app.use("/feed", feedRoute);

// for testing only
api.get("/", async (req, res) => {
    return res.send("It works! 😃 Thanks gods!");
    // return res.json(users);
});

app.use('/api', api);

/** Start a server */
(async () => {
    await mongoose.connect(AppConfig.DB_SERVER)
        .then(() => logger("Server", "Syncing database hahahaaas", "🚀", "😃"))
        .catch((err) =>
            logger("Server", err, "🚨", "😭", "error")
        );

    const server = app.listen(config.PORT, "0.0.0.0", () => {
        logger(
            "Server",
            `running on port ${chalk.bold(":" + config.PORT)}`,
            "🚀",
            "😃"
        );
    });

    const io = socketioServer(server, {
        cors: "http://127.0.0.1:5377"
    });

    io.use((socket: any, next) => {
        const token = socket.handshake.headers["cookie"];
        console.log(token)
        if (!token || token.length <= 0) {
            return next(new Error("Token required!"));
        }

        try {
            const user = jsonwebtoken.verify(token.replace('user=', ''), config.JWT_SECRET) as any;
            socket.user_id = user.id;
            socket.state = {
                building: false
            };
        } catch (e) {
            return next(new Error(e.message || "Authentication error!"));
        }
        next();
    });

    socketio.setSocket(io);
    console.log('Initialized socketio');
    io.on('connection', (sk) => {
        socketio.setUsers([]);
        for (let [id] of Object.entries(io.of('/').sockets)) {
            const socket = io.sockets.sockets[id];
            socketio.setUser({
                id: socket.user_id,
                socket: socket
            });
        }

        sk.on('build.start', (message) => {
            if (!sk.state.building) {
                console.log('Start building...')
                sk.state.building = true;
                try {

                    const cmd = spawn('node', ['index.js'], { stdio: ['inherit', 'pipe', 'pipe'], env: { ...process.env } });

                    // cmd.stdout.on('data', (data) => {
                    //     sk.emit('build.log', data.toString());
                    // });

                    // cmd.stderr.on('data', (data) => {
                    //     io.emit('build.log', data.toString());
                    // });

                    // cmd.stdout.pipe(process.stdout);
                    // cmd.stdin.pipe(process.stdin);

                    cmd.stdout.on('data', (data) => {
                        process.stdout.write(data);
                        io.emit('build.log', data.toString());
                    });

                    cmd.stderr.on('data', (data) => {
                        process.stdout.write(data);
                        io.emit('build.err', data.toString());
                    })

                    cmd.stdout.on('end', (code) => {
                        sk.state.building = false;
                        sk.emit('build.end', code);
                    });

                    cmd.on('close', (code) => {
                        sk.state.building = false;
                        sk.emit('build.end', code);
                    });
                } catch (e) {
                    // console.log(e);
                }
            }
        });
    });

    // setInterval(() => {
    //     io.emit("test", Date.now());
    // }, 1000);

})();