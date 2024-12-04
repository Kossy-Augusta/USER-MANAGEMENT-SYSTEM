import { Request, Response } from "express";

export default interface UserAuthInterface {
    create(req: Request, res: Response): Promise<Response>,
    login(req: Request, res: Response): Promise<Response>,
    logout(req: Request, res: Response): Promise<Response>,
    refreshToken(req: Request, res: Response): Promise<Response>
}
