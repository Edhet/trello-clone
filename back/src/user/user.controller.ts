import { attachMiddleware, Body, Controller, Get, Post, Query, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { logger } from "../main";
import { UserInterface } from "./user.model";
import LoginRegisterRequest from "./login-register-request.dto";
import { autoInjectable } from "tsyringe";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";

@autoInjectable()
@Controller('/user')
export class UserController {

    constructor(private userService: UserService) { }

    @Get('', [AuthMiddleware])
    async getUser(@Req() req: Request, @Res() res: Response, @Query('id') id: string) {
        logger.trace(`Starting request for getUser`)

        let user
        try {
            user = await this.userService.getUser(id)
        } catch (e) {
            logger.error(e)
            return res.status(500).json({ message: "Erro no banco de dados" })
        }

        if (!user) return res.status(404).json({ message: "Usuário não encontrado" })

        return res.status(200).json({ id: user._id, username: user.username, accesses: user.accesses } as UserInterface)
    }

    @Post('')
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
}