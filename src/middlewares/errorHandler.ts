import { Request, NextFunction, Response } from "express";
import { constants } from "http2";

export const errorHandler = (err: any, _req:Request, response: Response, _next: NextFunction)=>{
    let customErr = err;
    try {
        if (typeof customErr === "string") {
            customErr =  JSON.parse(customErr);
        }
    } catch{}
    if (customErr?.description) {
        response.status(customErr.statusCode).send(customErr);
    }
    response.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        statusCode: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        description: err.message
    })
}