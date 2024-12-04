import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import envVars from "../validators/env_validation";
import { handleError } from "../utils/responseHandlers";


const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken: string = envVars.ACCESS_TOKEN_SECRET;

    if (!authHeader?.startsWith("Bearer ")) {
        handleError(res, 400, "Unauthorized");
        return;
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessToken, (err, decoded: any) => {
        if (err) {
            handleError(res, 403, err.message || "Token verification failed");
            return;
        }

        if (decoded) {
            req.userInfo = {
                first_name: decoded.userInfo.first_name,
                last_name: decoded.userInfo.last_name,
                roles: decoded.userInfo.roles,
            };
        }

        next();
    });
};


export default verifyJWT;
