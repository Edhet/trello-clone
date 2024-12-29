import { Body, Controller, Get, Post, Query, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { logger } from "../main";
import { UserInterface } from "./user.model";
import LoginRegisterRequest from "./login-register-request.dto";
import { autoInjectable } from "tsyringe";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { JwtService } from "../shared/services/jwt.service";
import { DEFAULT_UNAUTHORIZED_MESSAGE } from "../shared/constants";

@autoInjectable()
@Controller('/user')
export class UserController {

    constructor(private userService: UserService, private jwtService: JwtService) { }

    @Post('/register')
    async registerUser(@Req() req: Request, @Res() res: Response, @Body() userInfo: LoginRegisterRequest) {
        logger.trace(`Starting request for registering new user`)
        
        let loginResponse
        try {
            loginResponse = await this.userService.createUser(userInfo)
        } catch(e) {
            logger.error(e)
            return res.status(500).json({ message: "Erro no banco de dados" })
        }
        return res.status(201).json(loginResponse)
    }

    @Post('/login')
    async loginUser(@Req() req: Request, @Res() res: Response, @Body() loginInfo: LoginRegisterRequest) {
        logger.trace(`Starting request for user login`)

        let loginResponse
        try {
            loginResponse = await this.userService.login(loginInfo)
        } catch(e) {
            logger.error(e)
            return res.status(500).json({ message: "Erro no banco de dados" })
        }
        return res.status(200).json(loginResponse)
    }

    @Get('/auth')
    async authSession(@Req() req: Request, @Res() res: Response) {
        logger.trace(`Starting request for auth`)
        const authHeader = req.headers.authorization

        const decodedToken = this.jwtService.decodeAuthHeader(authHeader)
        if (!decodedToken) return res.status(401).json({ message: DEFAULT_UNAUTHORIZED_MESSAGE })

        return res.status(200).json({ username: decodedToken.username })
    }

    @Get('', [AuthMiddleware])
    async getUser(@Req() req: Request, @Res() res: Response, @Query('username') username: string) {
        logger.trace(`Starting request for getUser`)

        let user
        try {
            user = await this.userService.getUser(username)
        } catch (e) {
            logger.error(e)
            return res.status(500).json({ message: "Erro no banco de dados" })
        }

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" })

        return res.status(200).json({ id: user._id, username: user.username, accesses: user.accesses } as UserInterface)
    }

    @Post('/change-pwd', [AuthMiddleware])
    async changePwd(@Req() req: Request, @Res() res: Response, @Body() newPwd: { novaSenha: string }) {
        logger.trace(`Starting request for changing password`)
        const authHeader = req.headers.authorization
        const decodedToken = this.jwtService.decodeAuthHeader(authHeader)!

        try {
            await this.userService.changePwd(newPwd.novaSenha, decodedToken.username)
        } catch(e) {
            logger.error(`Error changing password of existing user`)
            logger.trace(e)
            return res.status(500).json({ message: "Erro alterando senha" })
        }
        
        return res.status(201).json({ message: "Senha alterada com sucesso" })
    }
}