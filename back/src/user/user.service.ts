import { injectable } from "tsyringe";
import { User } from "./user.model";
import { logger } from "../main";
import LoginRegisterRequest from "./login-register-request.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import LoginResponse from "./login-response.dto";

@injectable()
export class UserService {

    private readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
    private readonly JWT_PASSWORD =  process.env.JWT_PASSWORD!.toString()
    private readonly JWT_EXPIRE_HOURS = Number(process.env.JWT_EXPIRE_HOURS)

    constructor() { }

    async getUser(id: string) {
        logger.trace(`Starting query for user with id: ${id}`)
        const user = await User.findById(id)
        return user
    }

    async createUser(registerInfo: LoginRegisterRequest): Promise<LoginResponse> {
        logger.trace(`Creating new user with info: `, registerInfo)

        const salt = bcrypt.genSaltSync(this.SALT_ROUNDS)
        const hash = await bcrypt.hashSync(registerInfo.password, salt)

        const newUser = new User({ 
            username: registerInfo.username,
            password: hash, 
            accesses: []
        })
        await newUser.save()
        logger.trace(`Created new user`)

        const jwt = await this.login(registerInfo)
        if (!jwt) throw new Error('Failed to make a login with recently created credentials')
        return jwt
    }

    async login(loginInfo: LoginRegisterRequest): Promise<LoginResponse | null> {
        logger.trace(`Making login on account with username: ${loginInfo.username}`)

        const user = await User.findOne({ username: loginInfo.username })
        if (!user) {
            logger.trace(`User with username ${loginInfo.username} not found`)
            return null
        }
        if (!bcrypt.compareSync(loginInfo.password, user.password!)) {
            logger.trace(`Login try on user ${loginInfo.username} with wrong password`)
            return null
        }

        logger.trace(`Creating JWT for successful login attempt`)
        const unsignedJwt = {
            username: loginInfo.username,
            authDate: new Date(),
            expireDate: new Date().getHours() + this.JWT_EXPIRE_HOURS
        }

        const token = jwt.sign(JSON.stringify(unsignedJwt), this.JWT_PASSWORD)
        logger.trace(`JWT Created`)

        return { jwt: token }
    }
}