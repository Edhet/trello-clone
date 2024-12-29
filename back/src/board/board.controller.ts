import { autoInjectable } from "tsyringe";
import { BoardService } from "./board.service";
import { Controller, Get, Req, Res } from "@decorators/express";
import { logger } from "../main";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { Request, Response } from "express";
import { extractKnownValidToken } from "../shared/util";

@autoInjectable()
@Controller('/boards')
export class BoardController {
    constructor(private boardService: BoardService) { }

    @Get('/all', [AuthMiddleware])
    async getUserBoards(@Req() req: Request, @Res() res: Response) {
        logger.trace(`Starting request to get all user's boards`)
        const username = extractKnownValidToken(req).email


    }
}