import { autoInjectable, injectable } from "tsyringe";
import { User } from "./user.model";
import { logger } from "../main";
import LoginRegisterRequest from "./login-register-request.dto";
import bcrypt from "bcryptjs";
import LoginResponse from "./login-response.dto";
import { JwtService } from "../shared/services/jwt.service";
import BadRequestError from "../shared/error/bad-request.error";
import NotFoundError from "../shared/error/not-found.error";

@injectable()
@autoInjectable()
export class UserService {

    private readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
    private readonly EMAIL_PATTERN = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/

    constructor(private jwtService: JwtService) { }

    async getUser(email: string) {
        logger.trace(`Starting query for user with email: ${email}`)

        if (!email) throw new BadRequestError("Email vazio")
        const user = await User.findOne({ email: email })
        if (!user) throw new NotFoundError(`Usuário com email '${email}' não existe`)
        return user
    }

    async createUser(registerInfo: LoginRegisterRequest): Promise<LoginResponse> {
        logger.trace(`Creating new user with info: `, registerInfo)

        if (!this.EMAIL_PATTERN.test(registerInfo.email)) throw new BadRequestError("Formato de email inválido")

        const salt = bcrypt.genSaltSync(this.SALT_ROUNDS)
        const hash = await bcrypt.hashSync(registerInfo.password, salt)

        const newUser = new User({
            email: registerInfo.email,
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

    async login(loginInfo: LoginRegisterRequest): Promise<LoginResponse | undefined> {
        logger.trace(`Making login on account with email: ${loginInfo.email}`)

        if (!loginInfo.password) throw new BadRequestError("Senha vazia")

        const user = await this.getUser(loginInfo.email)

        if (!loginInfo.password || !bcrypt.compareSync(loginInfo.password, user!.password!)) throw new BadRequestError("Senha inválida")

        return { jwt: this.jwtService.createJwt(loginInfo) }
    }

    async changePwd(newPwd: string, email: string) {
        logger.trace(`Started changing password`)
        if (!newPwd) throw new BadRequestError("Senha sem vazia")

        const user = await this.getUser(email)

        const salt = bcrypt.genSaltSync(this.SALT_ROUNDS)
        const hash = await bcrypt.hashSync(newPwd, salt)

        user.password = hash
        user.save()
        logger.trace(`Password changed`)
    }
}