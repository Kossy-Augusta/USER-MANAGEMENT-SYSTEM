import { Request, Response, NextFunction } from "express";
import { handleError} from "../utils/responseHandlers";

const verifyRoles = (...allowedRoles: string[])=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        if (!req?.userInfo?.roles){
            handleError(res, 401, "Unauthorized Access");
            return
        }
        const rolesArray = [...allowedRoles];
        const result = req.userInfo.roles.map(role => rolesArray.includes(role)).find(value => value === true);
        if (!result) {
            handleError(res, 401, "Unauthorized, not enought privillages");
            return
        }
        next();
    }
}

export default  verifyRoles;
