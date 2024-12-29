import { Request } from "express";
import { container } from "tsyringe";
import { JwtService } from "./services/jwt.service";

export function extractKnownValidToken(req: Request) {
    const authHeader = req.headers.authorization
    return container.resolve(JwtService).decodeAuthHeader(authHeader)!
}