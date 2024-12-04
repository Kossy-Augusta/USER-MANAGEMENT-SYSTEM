import express, { Request, Response } from "express";
import UserManagementController from "../controllers/user.management";
import verifyRoles from "../middleware/validateRoles";
import { RolesList } from "../utils/enums";
import verifyJWT from "../middleware/validatJwt";
const router = express.Router();

const userManagement = new UserManagementController();
router.get("/delete/:id", verifyJWT, verifyRoles(RolesList.Admin), (req: Request, res: Response) =>{
    userManagement.delete(req, res);
});

export default router

