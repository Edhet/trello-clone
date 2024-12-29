import { injectable } from "tsyringe";
import LoginRegisterRequest from "../../user/login-register-request.dto";
import { logger } from "../../main";
import jwt from "jsonwebtoken";
import TokenInfo from "../models/token-info.model";
import BadRequestError from "../error/bad-request.error";

@injectable()
export class JwtService {

    private readonly JWT_PASSWORD = process.env.JWT_PASSWORD!.toString()
    private readonly JWT_EXPIRE_HOURS = Number(process.env.JWT_EXPIRE_HOURS)

    private readonly MILIS_IN_HOUR = 3600000

    private readonly AUTH_HEADER_PATTERN = /^Bearer\s[0-9a-zA-Z\-_\.]+$/

    constructor() { }

    createJwt(loginInfo: LoginRegisterRequest): string {
        logger.trace(`Creating JWT for successful login attempt`)
        const now = new Date()
        const expireDate = new Date(now.getTime() + this.MILIS_IN_HOUR * this.JWT_EXPIRE_HOURS)

        const unsignedJwt: TokenInfo = {
            email: loginInfo.email,
            authDate: now,
            expireDate: expireDate
        }
        const token = jwt.sign(JSON.stringify(unsignedJwt), this.JWT_PASSWORD)
        logger.trace(`JWT Created`)
        return token
    }

    decodeAuthHeader(authHeader: string | undefined) {
        const token = this.extractTokenFromAuthHeader(authHeader)
        if (!token) throw new BadRequestError("Header de autorização ausente")

        const decodedToken = this.decodeToken(token)

        return decodedToken
    }

    extractTokenFromAuthHeader(authHeader: string | undefined) {
        if (!authHeader || !this.AUTH_HEADER_PATTERN.test(authHeader))
            return
        return authHeader.split(" ")[1]
    }

    decodeToken(jwtToken: string) {
        let token
        
        try {
            token = jwt.verify(jwtToken, this.JWT_PASSWORD) as TokenInfo
        } catch(e) {
            throw new BadRequestError("Token inválido")
        }
        return token
    }
}