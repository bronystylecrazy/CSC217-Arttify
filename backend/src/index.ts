import * as chalk from "chalk";

/** Internal Modules */
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import jwt from "express-jwt";
import cookieParser from "cookie-parser";

/** Routes */
import authRoute from "@/routes/auth";

/** Misc */
import config from "./config";

/** logger */
import fs from "fs";
import path from "path";
import { logger } from "@/utils/serviceLog";
import AppConfig from "./config";
import { User } from "./databases/model";

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
    cors()
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
// app.use("/storage", storageRoute);
/** protected Routes */
// app.use("/event", eventRoute);
// app.use("/feed", feedRoute);

// for testing only
api.get("/", async (req, res) => {
    // return res.send("It works! 😃 Thanks gods!");
    const users = await User.find({});
    return res.json(users);
});

app.use('/api', api);

/** Start a server */
(async () => {
    await mongoose.connect(AppConfig.DB_SERVER)
        .then(() => logger("Server", "Syncing database hahaha", "🚀", "😃"))
        .catch((err) =>
            logger("Server", err, "🚨", "😭", "error")
        );

    app.listen(config.PORT, "0.0.0.0", () => {
        logger(
            "Server",
            `running on port ${chalk.bold(":" + config.PORT)}`,
            "🚀",
            "😃"
        );
    });
    // cron.schedule("*/2 * * * *", async function () {
    //     logger("Server", "Syncing database", "🚀", "😃");
    //     await initTables().catch((err) =>
    //         logger("Server", err, "🚨", "😭", "error")
    //     );
    // });
})();