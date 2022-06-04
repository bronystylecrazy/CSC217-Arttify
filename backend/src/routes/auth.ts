import AppConfig from '@/config';
import jwt from 'jsonwebtoken';
import express from 'express';
import passport from "passport"
import session from "express-session"
import passportGH from "passport-github2";
import passportJwt from 'passport'
const GitHubStrategy = passportGH.Strategy;

import { User } from '@/databases/model';
import { error, info } from '@/utils/handler';
import HttpStatus from '@/utils/httpStatus';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { Profile } from '@/interfaces/models/User';

const router = express.Router();

// passport.serializeUser(function (user, done) {
//     // console.log('SUSER: ', user);
//     done(null, user)
// })

// passport.deserializeUser(function (obj: any, done) {
//     // console.log('DUSER: ', obj);
//     done(null, obj)
// })

// passport.use(
//     new GitHubStrategy(
//         {
//             clientID: AppConfig.CLIENT_ID,
//             clientSecret: AppConfig.SECRET_ID,
//             callbackURL: AppConfig.REDIRECT_URI
//         },
//         async function (accessToken, refreshToken, profile, done) {
//             // asynchronous verification, for effect...
//             console.log({ accessToken, refreshToken, profile })
//             const user = await User.findOne({ username: profile.username });

//             if (!user) {
//                 const newUser = new User({
//                     username: profile.username,
//                     access_token: accessToken,
//                     refresh_token: refreshToken
//                 });
//                 await newUser.save();

//                 delete newUser["access_token"];
//                 delete newUser["refresh_token"];

//                 const token = jwt.sign({ ...newUser }, AppConfig.JWT_SECRET, { expiresIn: '7d' });
//                 return done(null, {
//                     token,
//                     profile
//                 });
//             }

//             delete user["access_token"];
//             delete user["refresh_token"];



//             const token = jwt.sign({ id: user._id, username: user.username }, AppConfig.JWT_SECRET, { expiresIn: '7d' });

//             return done(null, {
//                 token,
//                 profile
//             });
//         }
//     )
// )

// router.use(
//     session({
//         secret: "keyboard cat",
//         resave: false,
//         saveUninitialized: false,
//         cookie: {
//             httpOnly: true,
//             secure: true,
//             maxAge: 24 * 60 * 60 * 1000
//         }
//     })
// )

// router.use(passport.initialize())
// router.use(passport.session())

// router.get(
//     "/github",
//     passport.authenticate("github", { scope: ["repo", "user"] }), /// Note the scope here
//     function (req, res) {
//         // console.log('AUTHENTICATED USER:', req.user);
//         return res.redirect(AppConfig.BASE_URL)
//     }
// )

// router.get('/profile', async (req, res) => {
//     try {
//         const user = await User.findOne({ id: req.user.id, username: req.user.username });

//         if (!user) {
//             return error(res, 'User not found', HttpStatus.NOT_FOUND);
//         }

//         const { data: profile } = await axios.get(`https://api.github.com/users/${user.username}`, {
//             headers: {
//                 Authorization: `token ${user.access_token}`
//             }
//         });

//         const information = {
//             id: user._id,
//             profile
//         };

//         return info(res, "Fetch user profile success!", information, HttpStatus.OK);
//     } catch (e) {
//         console.log(e)
//         return error(res, e.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
// });

// router.get(
//     "/github/callback",
//     passport.authenticate("github", { failureRedirect: "/" }),
//     function (req, res) {
//         req.cookies["gh_token"] = req.user.token;
//         res.cookie("user", req.user.token, {
//             httpOnly: true,
//             secure: true
//         });
//         return res.redirect("/")
//     }
// )

router.get('/github/login', async (req, res) => {
    return res.redirect(`https://github.com/login/oauth/authorize?client_id=${AppConfig.CLIENT_ID}&redirect_uri=${AppConfig.REDIRECT_URI}&scope=user%20public_repo&path=${'/'}&state=${nanoid(32)}`)
});

router.get('/github', async (req, res) => {
    const code = req.query.code;
    const path = req.query.path || '/';
    const { data } = await axios.post(`https://github.com/login/oauth/access_token`, {}, {
        params: {
            client_id: AppConfig.CLIENT_ID,
            client_secret: AppConfig.SECRET_ID,
            code,
            redirect_uri: AppConfig.REDIRECT_URI
        },
        headers: {
            Accept: "application/json"
        }
    });

    console.log(data);

    const response = await axios.get<Profile>(`https://api.github.com/user`, {
        headers: {
            Authorization: `token ${data.access_token}`
        }
    });

    const user = await User.findOne({ username: response.data.login });

    if (!user) {
        const newUser = new User({
            username: response.data.login,
            access_token: data.access_token,
            refresh_token: data.refresh_token
        });
        await newUser.save();
    } else {
        user.access_token = data.access_token;
        user.refresh_token = data.refresh_token;
        await user.save();
    }

    const jwtToken = jwt.sign({
        id: user._id,
        username: user.username,
        token: user.access_token
    }, AppConfig.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("user", jwtToken,
        // {
        //     httpOnly: true,
        //     secure: true
        // }
    );

    // console.log(data)
    return res.redirect('/')
});

router.get('/me', async (req, res) => {
    try {
        console.log('profile: ', req?.user?.token);
        const response = await axios.get<Profile>(`https://api.github.com/user`, {
            headers: {
                Authorization: `token ${req?.user?.token}`
            }
        });

        return info<Profile>(res, "Fetch user profile success!", response.data, HttpStatus.OK);
    } catch (e) {
        return error(res, e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
});


export default router;