import {User} from "../model/User"
import UserManagement from "../interfaces/user.management.interface";
import { Request, Response } from "express";
import { deleteUser } from "../validators/form_validation";
import { handleError, handleSuccess } from "../utils/responseHandlers";

export default class UserManagementController implements UserManagement{
    async delete(req: Request, res: Response): Promise<Response> {

        const {error, value} = deleteUser.validate(req.params, {abortEarly: false});
        if (error) return handleError(res, 422, error.details[0].message);
        try {
            const userToDelete = await User.findById(value.id).exec();
            if(!userToDelete) return handleError(res, 404, "User not found");
            await userToDelete.deleteOne();
            return handleSuccess(res, 204, "User deleted successfully")
        } catch (error) {
            return handleError(res, 500, error)
        }
    }
}