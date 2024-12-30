import { Body, Controller, Delete, Post, Put, Query, Req, Res } from "@decorators/express";
import { autoInjectable } from "tsyringe";
import { logger } from "../main";
import { extractKnownValidToken } from "../shared/util";
import { CardInterface } from "./card.model";
import { Request, Response } from "express";
import { CardService } from "./card.service";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";

@autoInjectable()
@Controller('/cards', [AuthMiddleware])
export class CardController {

    constructor(private cardService: CardService) { }

    @Post('/new')
    async createCard(@Req() req: Request, @Res() res: Response, @Query('board-id') boardId: string,  @Query('list-id') listId: string, @Body() request: CardInterface) {
        logger.trace(`Starting request to create a new card`)
        const email = extractKnownValidToken(req).email
        
        const newCard = await this.cardService.createCard(boardId, email, listId, request)

        return res.status(201).json(newCard)
    }
 
    @Delete('/delete')
    async deleteCard(@Req() req: Request, @Res() res: Response, @Query('board-id') boardId: string,  @Query('list-id') listId: string, @Query('id') cardId: string) {
        logger.trace(`Starting request to delete a card`)
        const email = extractKnownValidToken(req).email
        
        await this.cardService.deleteCard(boardId, email, listId, cardId)

        return res.status(200).json()
    }
 
    @Put('/edit')
    async editCard(@Req() req: Request, @Res() res: Response, @Query('board-id') boardId: string,  @Query('list-id') listId: string, @Body() request: CardInterface) {
        logger.trace(`Starting request to edit a card`)
        const email = extractKnownValidToken(req).email
        
        const newCard = await this.cardService.editCard(boardId, email, listId, request._id!, request)

        return res.status(200).json(newCard)
    }   
}