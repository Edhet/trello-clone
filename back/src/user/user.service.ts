import { autoInjectable, injectable } from "tsyringe";
import { User } from "./user.model";
import { logger } from "../main";
import LoginRegisterRequest from "./login-register-request.dto";
import bcrypt from "bcryptjs";
import LoginResponse from "./login-response.dto";
import { JwtService } from "../shared/services/jwt.service";
import BadRequestError from "../shared/error/bad-request.error";
import NotFoundError from "../shared/error/not-found.error";
import BoardInterface from "../board/board.model";
import AccessType from "./access-type.enum";
import { EmailService } from "../shared/services/email.service";

@injectable()
@autoInjectable()
export class UserService {

    private readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS)
    private readonly EMAIL_PATTERN = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/

    constructor(private jwtService: JwtService, private emailService: EmailService) { }

    async getUserById(id: string) {
        logger.trace(`Starting query for user with id: ${id}`)

        const user = await User.findById(id)
        if (!user) throw new NotFoundError(`Usuário com id '${id}' não existe`)
        return user
    }

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
        logger.trace(`Making login on account with email ${loginInfo.email}`)

        if (!loginInfo.password) throw new BadRequestError("Senha vazia")

        const user = await this.getUser(loginInfo.email)

        if (!loginInfo.password || !bcrypt.compareSync(loginInfo.password, user!.password!)) throw new BadRequestError("Senha inválida")

        return { jwt: this.jwtService.createJwt(loginInfo) }
    }

    async changePwd(newPwd: string, email: string) {
        logger.trace(`Started changing password`)
        if (!newPwd) throw new BadRequestError("Senha vazia")

        const user = await this.getUser(email)

        const salt = bcrypt.genSaltSync(this.SALT_ROUNDS)
        const hash = await bcrypt.hashSync(newPwd, salt)

        user.password = hash
        user.save()
        logger.trace(`Password changed`)
    }

    async sendPasswordResetEmail(email: string) {
        logger.trace(`Starting password reset email process for ${email}`);

        const user = await this.getUser(email);

        const resetToken = this.jwtService.createResetJwt(email);
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const emailContent = {
            to: email,
            subject: "Recuperação de Senha",
            text: `Olá,\n\nClique no link abaixo para redefinir sua senha:\n\n${resetLink}\n\nSe você não solicitou esta alteração, ignore este email.`,
        };

        await this.emailService.sendEmail(emailContent);

        logger.trace(`Password reset email sent to ${email}`);
    }

    async addAccess(userEmail: string, board: BoardInterface, type: AccessType) {
        logger.trace(`Adding access for ${userEmail} to board`)
        const user = await this.getUser(userEmail)

        for (let accesses of user.accesses) {
            if (accesses.board as any == board._id) throw new BadRequestError("Usuário já tem permissão")
        }

        const newAccess = { type, board }
        user.accesses.push(newAccess)

        await user.save()
        logger.trace(`Access created`)
    }

    async removeAccess(userEmail: string, boardId: string) {
        logger.trace(`Removing access for ${userEmail} to board`)
        const user = await this.getUser(userEmail)
        const oldAc = user.accesses.length

        user.accesses = user.accesses.filter(ac => ac.board as any != boardId)
        if (oldAc == user.accesses.length) throw new BadRequestError("Usuário já não possui essa permissão")
        
        await user.save()
        logger.trace(`Access removed`)
    }

    async removeAllBoardAccesses(boardId: string) {
        logger.trace(`Deleting all board accesses for board`)
        const usersWithAccess = await User.find({ 'accesses.board': boardId })

        for (let user of usersWithAccess) {
            user.accesses = user.accesses.filter(ac => ac.board as any != boardId)
        }

        User.bulkSave(usersWithAccess)
        logger.trace(`All accesses for board deleted`)
    }

    async favoriteBoard(boardId: string, userEmail: string) {
        logger.trace(`Favoriting board`)
        const user = await this.getUser(userEmail)

        user.accesses.forEach(access => {
            if (access.board as any == boardId) access.favorite = !access.favorite
        })

        user.save()
        logger.trace(`Board favorited`)
    }
}
