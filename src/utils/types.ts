import mongoose from "mongoose";

// add custom property to the request object
declare global {
    namespace Express {
    interface Request {
        userInfo?: UserInfo;
    }
    }
}
// response object
export type ResponseObject = {
    error: boolean;
    message: string;
    data?: object;  // Optional property
}
//payload to create new user
export type newUserRequest ={
    email: string,
    first_name: string,
    last_name: string,
    password: string,
}
export type deleteUserRequest ={
    id: mongoose.Types.ObjectId
}
//payload to login user
export type userLogin ={
    email: string,
    password: string
}
// data to be returned as response
export type dataObject = {
    id: mongoose.Types.ObjectId;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
};
 export type Cookies = {
    Name: string,
    Value: string,
}
export type UserInfo = {
    first_name: string;
    last_name: string;
    roles: string[];
}

export type Decoded ={
    userInfo: UserInfo
}