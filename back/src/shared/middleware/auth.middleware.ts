import { NextFunction, Request, Response } from "express";
import { logger } from "../../main";
import { Middleware } from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { JwtService } from "../services/jwt.service";
import { DEFAULT_UNAUTHORIZED_MESSAGE } from "../constants";

@autoInjectable()
export class AuthMiddleware implements Middleware {
    
    constructor(private jwtService: JwtService) { }

    public use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
    
        const decodedToken = this.jwtService.decodeAuthHeader(authHeader)
        const now = new Date()
        
        if (!decodedToken || now > decodedToken.expireDate)
            return this.unauthorizedResponse(res)
        
        logger.trace(`Request with valid JWT will be processed`)
        next()
    }
    
    private unauthorizedResponse(res: Response) {
        logger.trace(`Request with invalid JWT returned status code 401`)
        return res.status(401).json({ message: DEFAULT_UNAUTHORIZED_MESSAGE })
    }
}