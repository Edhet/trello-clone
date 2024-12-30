import { autoInjectable } from "tsyringe";
import { BoardService } from "./board.service";
import { Body, Controller, Delete, Get, Params, Patch, Post, Put, Query, Req, Res } from "@decorators/express";
import { logger } from "../main";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { Request, Response } from "express";
import { extractKnownValidToken } from "../shared/util";
import NewBoardRequest from "./new-board-request.dto";
import BoardInterface from "./board.model";
import PermissionRequest from "./access-request.dto";

@autoInjectable()
@Controller('/boards', [AuthMiddleware])
export class BoardController {
    
    constructor(private boardService: BoardService) { }

    @Get('/all')
    async getUserBoards(@Req() req: Request, @Res() res: Response) {
        logger.trace(`Starting request to get all user's boards`)
        const email = extractKnownValidToken(req).email

        return res.status(200).json({ boards: await this.boardService.getUserBoards(email) })
    }

    @Get('/:id')
    async getBoard(@Req() req: Request, @Res() res: Response, @Params('id') boardId: string) {
        logger.trace(`Starting request to get specific board`)
        const email = extractKnownValidToken(req).email
        
        return res.status(200).json({ board: await this.boardService.getBoard(boardId, email) })
    }

    @Post('/new')
    async createBoard(@Req() req: Request, @Res() res: Response, @Body() boardInfo: NewBoardRequest) {
        logger.trace(`Starting request to create a new board`)
        const email = extractKnownValidToken(req).email

        const newBoard = await this.boardService.createBoard(boardInfo, email) as BoardInterface
        return res.status(201).json(newBoard)
    }

    @Delete('/delete')
    async deleteBoard(@Req() req: Request, @Res() res: Response, @Query('id') boardId: string) {
        logger.trace(`Starting request to delete a board`)
        const email = extractKnownValidToken(req).email

        await this.boardService.deleteBoard(boardId, email)
        return res.status(200).json()
    }

    @Patch('/favorite')
    async favoriteBoard(@Req() req: Request, @Res() res: Response, @Query('id') boardId: string) {
        logger.trace(`Starting request to favorite a board`)
        const email = extractKnownValidToken(req).email

        await this.boardService.favoriteBoard(boardId, email)
        return res.status(200).json()
    }

    @Post('/grant')
    async grantPermission(@Req() req: Request, @Res() res: Response, @Body() request: PermissionRequest) {
        logger.trace(`Starting request to grant permission`)
        const email = extractKnownValidToken(req).email

        await this.boardService.grantPermission(email, request)
        return res.status(200).json()
    }

    @Post('/ungrant')
    async removePermission(@Req() req: Request, @Res() res: Response, @Body() request: PermissionRequest) {
        logger.trace(`Starting request to remove permission`)
        const email = extractKnownValidToken(req).email

        await this.boardService.removePermission(email, request)
        return res.status(200).json()
    }

    @Put('/edit')
    async editBoard(@Req() req: Request, @Res() res: Response, @Query('id') boardId: string, @Body() newInfo: NewBoardRequest) {
        logger.trace(`Starting request to edit board info`)
        const email = extractKnownValidToken(req).email

        const edited = await this.boardService.editBoard(email, boardId, newInfo) as BoardInterface
        return res.status(200).json(edited)
    }
}