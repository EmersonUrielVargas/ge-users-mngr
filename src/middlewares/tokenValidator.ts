import { SECRET_KEY } from "@config";
import { Constants } from "@utilities/constants";
import { Request, NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const tokenValidator = (req:Request, res: Response, _next: NextFunction)=>{
    const authHeader = req.get(Constants.headerToken);
    try {
        if (authHeader) {
            const token = authHeader.split(' ');
            if (token && token[0].toLowerCase() === 'bearer') {
                const decodeToken = jwt.verify(token[1], SECRET_KEY);
                res.locals.user = decodeToken;
            }
        }
    } catch {}
    _next();
}