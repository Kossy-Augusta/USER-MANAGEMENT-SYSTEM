import { User } from "../model/User";
import UserAuthInterface from "../interfaces/auth.interface";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { newUser, loginUser, } from "../validators/form_validation";
import { handleError, handleSuccess } from "../utils/responseHandlers";
import { ResponseObject } from "../utils/types";
import envVars from "../validators/env_validation";

export default class UserAuthController implements UserAuthInterface {
    async create(req: Request, res: Response): Promise<Response> {
        try {
        const { value, error } = newUser.validate(req.body, {
            abortEarly: false,
        });
        if (error) return handleError(res, 422, error.details[0].message);
        // check for existing user
        const existingUser = await User.findOne({ email: value.email }).exec();
        if (existingUser) return handleError(res, 409, "Email already exists");
        const hasPwd = await bcrypt.hash(value.password, 10);
        const newCreatedUser = await User.create({
            email: value.email,
            first_name: value.first_name,
            last_name: value.last_name,
            password: hasPwd,
        });
        const data: ResponseObject = {
            error: false,
            message: "Success",
            data: newCreatedUser,
        };
        return handleSuccess(res, 201, "New User created", data);
        } catch (error) {
        console.log(error);
        return handleError(res, 500, error);
        }
    }
    async login(req: Request, res: Response): Promise<Response> {
        try {
        const { error, value } = loginUser.validate(req.body);
        if (error) return handleError(res, 422, error.details[0].message);
        // check if user exists
        const user = await User.findOne({ email: value.email }).exec();
        if (!user) return handleError(res, 400, "Unauthorized access");
        const verifyPassword = await bcrypt.compare(
            value.password,
            user.password
        );
        if (!verifyPassword) return handleError(res, 401, "Incorrect password");
        const roles = user.roles;
        // create JWT
        const accessTokenSecret = envVars.ACCESS_TOKEN_SECRET
        const accessToken = jwt.sign(
            {
            userInfo: {
                first_name: user.first_name,
                last_name: user.last_name,
                roles,
            },
            },
            accessTokenSecret,
            { expiresIn: "10m" }
        );
        const refreshTokenSecret = envVars.REFRESH_TOKEN_SECRET
        const refreshToken = jwt.sign(
            {
            userInfo: {
                first_name: user.first_name,
                last_name: user.last_name,
                roles,
            },
            },
            refreshTokenSecret,
            { expiresIn: "1d" }
        );
        // save refresh token in DB
        user.refresh_token = refreshToken;
        await user.save();
        // set the cookie with refresh token
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        const data: object = {
            token: accessToken,
            id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
        };
        return handleSuccess(res, 200, `Login successful`, data);
        } catch (error) {
        return handleError(res, 500, error);
        }
    }
    async logout(req: Request, res: Response): Promise<Response> {
        const cookies = req.cookies;
        if (!cookies?.jwt) return handleError(res, 400, "No cookie found");
        const refreshToken = cookies.jwt;
        try {
        const currentUser = await User.findOne({
            refresh_token: refreshToken,
        }).exec();
        if (!currentUser) {
            res.clearCookie("jwt", {
            httpOnly: true,
            // secure: true
            });
            return handleError(res, 204, "User already logged out");
        }
        // reset refresh token for user to empty string;
        currentUser.refresh_token = "";
        await currentUser.save();
        res.clearCookie("jwt", {
            httpOnly: true,
            // secure: true
        });
        return handleSuccess(res, 200, "User logged out succesfully");
        } catch (error) {
        return handleError(res, 500, error);
        }
    }
    async refreshToken(req: Request, res: Response): Promise<Response> {
        const cookies = req.cookies;
        if (!cookies?.jwt) return handleError(res, 400, "No cookie found");
        const refreshToken = cookies.jwt;
        try {
            const authUser = await User.findOne({
            refresh_token: refreshToken,
            }).exec();
            if (!authUser) {
                return handleError(res, 403, "Unauthorized");
            }
            const refreshTokenSecret= envVars.REFRESH_TOKEN_SECRET;
            const accessTokenSecret = envVars.REFRESH_TOKEN_SECRET;
            const decoded = await new Promise<any>((resolve, reject) => {
                jwt.verify(refreshToken, refreshTokenSecret, (err: any, decoded: any) => {
                    if (err) {
                    return reject(err);  // Reject the promise if there's an error
                    }
                    resolve(decoded);  // Resolve the promise with the decoded token
                });
            });
            if (!decoded) return handleError(res, 403, "Incalid Token")
            console.log("Decoded token:", decoded);
            const newAccessToken = jwt.sign(
                {
                userInfo:{
                    first_name: authUser.first_name,
                    last_name: authUser.last_name,
                    roles: authUser.roles,
                    },
                },
                accessTokenSecret,
                {expiresIn: "10m"}
            );
            const data = {
                token: newAccessToken,
                id: decoded._id,
            }
            return handleSuccess(res, 200, "New access token created",data )
        } catch(error){
            return handleError(res, 500, error);
        }
    }
}
