import { NextFunction, Request, Response } from "express";
import { logger } from "../../main";
import jwt from "jsonwebtoken";
import { Middleware } from "@decorators/express";

export class AuthMiddleware implements Middleware {
    private readonly JWT_PASSWORD =  process.env.JWT_PASSWORD!.toString()
    
    constructor() { }

    public use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
    
        const authPattern = /^Bearer\s[0-9a-zA-Z\-_\.]+$/
        if (!authHeader || !authPattern.test(authHeader)) return this.unauthorizedResponse(res)
    
        let token
        try {
            token = jwt.verify(authHeader.split(" ")[1], this.JWT_PASSWORD)
        } catch(e) {
            logger.trace(e)
            return this.unauthorizedResponse(res)
        }
        
        if (typeof token != 'string')
            return this.unauthorizedResponse(res)
    
        const now = new Date()
        if (now > JSON.parse(token).expireDate)
            return this.unauthorizedResponse(res)
    
        next()
    }
    
    private unauthorizedResponse(res: Response) {
        logger.trace(`Request with invalid JWT returned status code 401`)
        return res.status(401).json({ message: "Você não está autorizado para esta requisição" })
    }
}