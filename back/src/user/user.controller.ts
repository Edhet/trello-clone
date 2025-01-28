import { Body, Controller, Get, Post, Query, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { logger } from "../main";
import { UserInterface } from "./user.model";
import LoginRegisterRequest from "./login-register-request.dto";
import { autoInjectable } from "tsyringe";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { extractKnownValidToken } from "../shared/util";

@autoInjectable()
@Controller('/user')
export class UserController {

    constructor(private userService: UserService) { }

    @Post('/register')
    async registerUser(@Req() req: Request, @Res() res: Response, @Body() userInfo: LoginRegisterRequest) {
        logger.trace(`Starting request for registering new user`)

        let loginResponse
        loginResponse = await this.userService.createUser(userInfo)
        return res.status(201).json(loginResponse)
    }

    @Post('/login')
    async loginUser(@Req() req: Request, @Res() res: Response, @Body() loginInfo: LoginRegisterRequest) {
        logger.trace(`Starting request for user login`)

        let loginResponse = await this.userService.login(loginInfo)
        return res.status(200).json(loginResponse)
    }

    @Get('/auth', [AuthMiddleware])
    async authSession(@Req() req: Request, @Res() res: Response) {
        logger.trace(`Starting request for auth`)

        const decodedToken = extractKnownValidToken(req)
        return res.status(200).json({ email: decodedToken.email })
    }

    @Get('/info', [AuthMiddleware])
    async getUser(@Req() req: Request, @Res() res: Response, @Query('email') email: string) {
        logger.trace(`Starting request for getUser`)

        let user = await this.userService.getUser(email)

        return res.status(200).json({ id: user._id, email: user.email, username: user.username, accesses: user.accesses } as UserInterface)
    }

    @Post('/change-pwd', [AuthMiddleware])
    async changePwd(@Req() req: Request, @Res() res: Response, @Body() newPwd: { novaSenha: string }) {
        logger.trace(`Starting request for changing password`)

        const decodedToken = extractKnownValidToken(req)
        await this.userService.changePwd(newPwd.novaSenha, decodedToken.email)

        return res.status(200).json()
    }

    @Post('/reset-password')
    async sendPasswordResetEmail(@Req() req: Request, @Res() res: Response, @Body() body: { email: string }) {
        logger.trace(`Starting request for password reset`);

        const { email } = body;
        if (!email) {
            return res.status(400).json({ message: "Email field is required." });
        }

        await this.userService.sendPasswordResetEmail(email);

        return res.status(200).json({ message: "Reset email sent." });
    }

}