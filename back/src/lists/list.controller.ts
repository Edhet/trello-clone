import { Body, Controller, Delete, Params, Post, Put, Query, Req, Res } from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { ListService } from "./list.service";
import { Request, Response } from "express";
import { logger } from "../main";
import { extractKnownValidToken } from "../shared/util";
import NewListRequest from "./new-list-request.dto";
import { CardInterface } from "../card/card.model";

@autoInjectable()
@Controller("/lists", [AuthMiddleware])
export class ListController {
    
    constructor(private listService: ListService) { }

    @Post('/new')
    async createList(@Req() req: Request, @Res() res: Response, @Query('board-id') boardId: string, @Body() request: NewListRequest) {
        logger.trace(`Starting request to create a new list`)
        const email = extractKnownValidToken(req).email
        
        const newList = await this.listService.createList(boardId, email, request.title)
        
        return res.status(201).json(newList)
    }

    @Delete('/delete')
    async deleteList(@Req() req: Request, @Res() res: Response, @Query('board-id') boardId: string, @Query('id') listId: string) {
        logger.trace(`Starting request to delete a list`)
        const email = extractKnownValidToken(req).email

        await this.listService.deleteList(boardId, email, listId)

        return res.status(200).json()
    }

    @Put('/edit')
    async editList(@Req() req: Request, @Res() res: Response, @Query('board-id') boardId: string, @Body() request: NewListRequest) {
        logger.trace(`Starting request to edit a list`)
        const email = extractKnownValidToken(req).email

        const edited = this.listService.editList(boardId, email, request)

        return res.status(200).json(edited)
    }
}