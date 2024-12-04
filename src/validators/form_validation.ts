import Joi from "joi";
import { newUserRequest, userLogin, deleteUserRequest } from "../utils/types";
import mongoose from "mongoose"


export const newUser= Joi.object<newUserRequest>({
        email: Joi.string().email().lowercase().required(),
        first_name: Joi.string().alphanum().min(2).max(20).required(),
        last_name: Joi.string().alphanum().min(2).max(20).required(),
        password: Joi.string().pattern(new RegExp(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/)).required().messages({
            'string.pattern.base': '"password" must be alphanumeric, must contain atleast 1 capital letter and must have min of 6 characters'
        }),
});

// login Vaidation Schema
export const loginUser = Joi.object<userLogin>({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required()
})

// delete a user
export const deleteUser= Joi.object<deleteUserRequest>({
    id: Joi.string()
        .custom((value, helpers)=>{
            if(!mongoose.Types.ObjectId.isValid(value)){
                return helpers.error('any.invalid');;
            }
            return value;
        })
        .required()
});