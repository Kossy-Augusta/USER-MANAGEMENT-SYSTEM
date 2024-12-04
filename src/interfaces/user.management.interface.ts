import {Request, Response} from "express";

export default interface UserManagement{
    delete(req: Request, res: Response): Promise<Response>,
}