import { NextFunction, Request, Response } from "express";
import { logger } from "../../main";
import { Middleware } from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { JwtService } from "../services/jwt.service";
import UnauthorizedError from "../error/unauthorized.error";

@autoInjectable()
export class AuthMiddleware implements Middleware {
    
    constructor(private jwtService: JwtService) { }

    public use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        const decodedToken = this.jwtService.decodeAuthHeader(authHeader)
        const now = new Date()
        
        if (!decodedToken || now > decodedToken.expireDate)
            throw new UnauthorizedError("Sessão expirada")
        
        logger.trace(`Request with valid JWT will be processed`)
        next()
    }
}