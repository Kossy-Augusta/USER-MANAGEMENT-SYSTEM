import express, {Request, Response} from "express";
import UserAuthController from "../controllers/authController";
import verifyJWT from "../middleware/validatJwt";
// import verifyJWT from "../middleware/validatJwt";

const userController = new UserAuthController;
const router = express.Router();

router.post("/register", (req: Request, res: Response)=>{userController.create(req, res)});
router.post("/login", (req: Request, res: Response)=>{userController.login(req, res)});
router.get("/logout", verifyJWT,(req: Request, res: Response)=>{userController.logout(req, res)});
router.get("/refresh",(req: Request, res: Response)=>{userController.refreshToken(req, res)});


export default router;
