import {Response} from "express";
import { ResponseObject } from "./types";


export const handleError = (
    res: Response,
    statusCode: number, 
    error: unknown
): Response =>{
    const errorMessage = error instanceof Error
    ? error.message
    : typeof error === "string"
        ? error
        : 'An Unexpected Erroe occured'
    
    const response: ResponseObject ={
        error: true,
        message: errorMessage
    };
    return res.status(statusCode).json(response);
}

// success response handler
export const handleSuccess = (
    res: Response,
    statusCode: number,
    message: string,
    data?: object,
): Response =>{
    const response: ResponseObject ={
        error: false,
        message,
        data
    }
    return res.status(statusCode).json(response)
}