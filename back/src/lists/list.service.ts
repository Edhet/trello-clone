import { injectable } from "tsyringe";
import { logger } from "../main";
import { UserService } from "../user/user.service";
import BadRequestError from "../shared/error/bad-request.error";
import { ListInterface } from "./list.model";
import AccessType from "../user/access-type.enum";
import NewListRequest from "./new-list-request.dto";
import { BoardService } from "../board/board.service";

@injectable()
export class ListService {

    constructor(private userService: UserService, private boardService: BoardService) { }

    async createList(boardId: string, email: string, listTitle: string) {
        logger.trace(`Creating new list`)

        if (!listTitle || !boardId) throw new BadRequestError("Campo vazio")

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
        const nextOrder = board.lists.length != 0 ? Math.max(...board.lists.map(l => l.order)) + 1 : 1

        const newList: ListInterface = {
            title: listTitle,
            order: nextOrder,
            cards: []
        }
        board.lists.push(newList)
        board = await board.save()
        
        logger.trace(`New list created successfully`)

        return board.lists.find(l => l.order == nextOrder)
    }

    async deleteList(boardId: string, email: string, listId: string) {
        logger.trace(`Deliting list`)

        if (!listId || !boardId) throw new BadRequestError("Campo vazio")

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
        const listIndex = board.lists.findIndex(list => list._id!.toString() == listId)
        if (listIndex == -1) {
            throw new BadRequestError("Lista não encontrada no quadro")
        }

        const removedOrder = board.lists[listIndex].order
        board.lists.forEach(l => {
            if (l.order > removedOrder) l.order--
        })

        board.lists.splice(listIndex, 1)
        await board.save()

        logger.trace(`List removed successfully`)
        return
    }

    async editList(boardId: string, email: string, newInfo: NewListRequest) {
        logger.trace(`Editing list`)

        if (!newInfo._id) {
            throw new BadRequestError("Nenhuma lista especificada")
        }

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
        const listToEdit = board.lists.find(l => l._id!.toString() == newInfo._id)
        if (!listToEdit) {
            throw new BadRequestError("Lista não está associada ao quadro")
        }

        Object.assign(listToEdit, newInfo)
        await board.save()

        logger.trace(`List edited successfully`)
        return listToEdit
    }
}