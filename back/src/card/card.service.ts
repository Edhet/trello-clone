import { autoInjectable, injectable } from "tsyringe";
import BadRequestError from "../shared/error/bad-request.error";
import { CardInterface } from "./card.model";
import { logger } from "../main";
import { UserService } from "../user/user.service";
import { BoardService } from "../board/board.service";
import AccessType from "../user/access-type.enum";

@injectable()
@autoInjectable()
export class CardService {

    constructor(private userService: UserService, private boardService: BoardService) { }
 
    async createCard(boardId: string, email: string, listId: string, cardInfo: CardInterface) {
        logger.trace(`Creating new card`)

        if (!cardInfo || !cardInfo.content || !boardId || !listId) throw new BadRequestError("Campo vazio")

        // Fetch user with their board access and populate relationships
        const user = await (await this.userService.getUser(email))
            .populate({
                path: 'accesses',
                populate: {
                    path: 'board',
                    populate: {
                        path: 'lists',
                        populate: { path: 'cards' }
                    }
                }
            })

        const access = user.accesses.find(access => access.board._id!.toString() == boardId)
        if (!access) {
            throw new BadRequestError("Quadro não está associado a usuário")
        }
        if (access.type == AccessType.READ_ONLY) {
            throw new BadRequestError("Você não tem permissão para esta operação")
        }

        let board = await this.boardService.getBoardById(access.board._id!)
        const listToAddCard = board.lists.find(l => l._id!.toString() == listId)
        if (!listToAddCard) {
            throw new BadRequestError("Lista não está associada ao quadro")
        }

        const nextPriority = listToAddCard.cards.length != 0 ? Math.max(...listToAddCard.cards.map(c => c.priority!)) + 1 : 1

        const nextCard: CardInterface = {
            content: cardInfo.content,
            priority: nextPriority,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        listToAddCard.cards.push(nextCard)

        board = await board.save()
        const changedList = board.lists.find(l => l._id!.toString() == listId)
        
        logger.trace(`New card created successfully`)
        return changedList!.cards.find(c => c.priority == nextPriority)
    }

    async deleteCard(boardId: string, email: string, listId: string, cardId: string) {
        logger.trace(`Deleting card`)

        if (!cardId || !listId || !boardId) throw new BadRequestError("Campo vazio")

        const user = await (await this.userService.getUser(email))
            .populate({
                path: 'accesses',
                populate: {
                    path: 'board',
                    populate: {
                        path: 'lists',
                        populate: { path: 'cards' }
                    }
                }
            })

        const access = user.accesses.find(access => access.board._id!.toString() == boardId)
        if (!access) {
            throw new BadRequestError("Quadro não está associado a usuário")
        }
        if (access.type == AccessType.READ_ONLY) {
            throw new BadRequestError("Você não tem permissão para esta operação")
        }

        const board = await this.boardService.getBoardById(access.board._id!)
        const listToRemoveCardFrom = board.lists.find(l => l._id!.toString() == listId)
        if (!listToRemoveCardFrom) {
            throw new BadRequestError("Lista não está associada ao quadro")
        }

        const cardIndex = listToRemoveCardFrom.cards.findIndex(card => card._id!.toString() == cardId)
        if (cardIndex == -1) {
            throw new BadRequestError("Cartão não encontrado na lista")
        }

        const removedPriority = listToRemoveCardFrom.cards[cardIndex].priority!
        listToRemoveCardFrom.cards.forEach(c => {
            if (c.priority! > removedPriority) c.priority!--
        })

        listToRemoveCardFrom.cards.splice(cardIndex, 1)
        await board.save()

        logger.trace(`Card deleted successfully`)
        return
    }


    async editCard(boardId: string, email: string, listId: string, cardId: string, newCardInfo: CardInterface) {
        logger.trace(`Editing card`)

        if (!cardId || !listId || !boardId) throw new BadRequestError("Campo vazio")

        const user = await (await this.userService.getUser(email))
            .populate({
                path: 'accesses',
                populate: {
                    path: 'board',
                    populate: {
                        path: 'lists',
                        populate: { path: 'cards' }
                    }
                }
            })

        const access = user.accesses.find(access => access.board._id!.toString() == boardId)
        if (!access) {
            throw new BadRequestError("Quadro não está associado a usuário")
        }
        if (access.type == AccessType.READ_ONLY) {
            throw new BadRequestError("Você não tem permissão para esta operação")
        }

        const board = await this.boardService.getBoardById(access.board._id!)
        const listToEditCard = board.lists.find(l => l._id!.toString() == listId)
        if (!listToEditCard) {
            throw new BadRequestError("Lista não está associada ao quadro")
        }

        const cardToEdit = listToEditCard.cards.find(card => card._id!.toString() == cardId)
        if (!cardToEdit) {
            throw new BadRequestError("Cartão não encontrado na lista")
        }

        newCardInfo.updatedAt = new Date()
        Object.assign(cardToEdit, newCardInfo)
        await board.save()

        logger.trace(`Card edited successfully`)
        return cardToEdit
    }
}