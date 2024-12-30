import { autoInjectable, injectable } from "tsyringe";
import { UserService } from "../user/user.service";
import { Board } from "./board.model";
import NewBoardRequest from "./new-board-request.dto";
import BadRequestError from "../shared/error/bad-request.error";
import { logger } from "../main";
import AccessType from "../user/access-type.enum";
import PermissionRequest from "./access-request.dto";
import path from "path";
import NotFoundError from "../shared/error/not-found.error";

@injectable()
@autoInjectable()
export class BoardService {

    private readonly HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}){1,2}$/

    constructor(private userService: UserService) { }

    async getUserBoards(email: string) {
        logger.trace(`Getting all boards for user ${email}`)
        const user = await (await this.userService.getUser(email))
            .populate({ path: 'accesses', populate: { path: 'board' } })

        const userAccessesAndBoards = user.accesses
        logger.trace(`Boards fetched`)

        return userAccessesAndBoards
    }

    async getBoard(boardId: string, email: string) {
        logger.trace(`Getting board for user ${email}`)
        const user = await (await this.userService.getUser(email))
            .populate({ path: 'accesses', populate: { path: 'board', populate: { path: 'lists', populate: { path: 'cards' } } } })

        for (let access of user.accesses) {
            if (access.board._id as any == boardId) {
                logger.trace(`Board fetched`)
                return access.board
            }
        }

        throw new BadRequestError("Quadro não está associado a usuário")
    }

    async getBoardById(boardId: string) {
        logger.trace(`Getting board by id with id ${boardId}`)

        const board = await Board.findById(boardId).populate({ path: 'lists', populate: { path: 'card' } })
        
        if (!board) 
            throw new NotFoundError(`Quadro com id ${boardId} não existe`)
        
        return board
    }

    async createBoard(boardInfo: NewBoardRequest, ownerEmail: string) {
        logger.trace(`Creating new board for user ${ownerEmail}`)
        if (!boardInfo.title || !boardInfo.textColor || !boardInfo.backgroundColor)
            throw new BadRequestError("Campo necessário está vazio")

        if (!this.HEX_COLOR_PATTERN.test(boardInfo.textColor) || !this.HEX_COLOR_PATTERN.test(boardInfo.backgroundColor))
            throw new BadRequestError("Valor de cor inválido")

        let newBoard = new Board({
            ...boardInfo,
            lists: []
        })
        newBoard = await newBoard.save()
        logger.trace(`Board created`)

        await this.userService.addAccess(ownerEmail, newBoard, AccessType.OWNER)
        return newBoard
    }

    async deleteBoard(boardId: string, userEmail: string) {
        logger.trace(`Deleting board ${boardId}`)

        const user = await this.userService.getUser(userEmail)

        for (let access of user.accesses) {
            if (access.board as any == boardId) {
                if (access.type != AccessType.OWNER) throw new BadRequestError("Você não tem permissão para esta operação")

                await Board.findByIdAndDelete(boardId)
                logger.trace(`Board ${boardId} sucessfully deleted`)
                await this.userService.removeAllBoardAccesses(boardId)
                return
            }
        }
        throw new BadRequestError("Quadro não encontrado")
    }

    async favoriteBoard(boardId: string, email: string) {
        if (!boardId) throw new BadRequestError("Nenhum quadro foi informado")
        await this.userService.favoriteBoard(boardId, email)
    }

    async grantPermission(userEmail: string, request: PermissionRequest) {
        logger.trace(`Granting a ${request.accessType} permission for board ${request.boardId} for user ${request.userEmail}`)

        if (!request.accessType) throw new BadRequestError("Campo obrigatório ausente: accessType")

        if (!Object.values(AccessType).includes(request.accessType) || request.accessType == AccessType.OWNER) throw new BadRequestError("Permissão inválida")

        const user = await this.userService.getUser(userEmail)

        for (let access of user.accesses) {
            if (access.board as any == request.boardId) {
                if (access.type != AccessType.OWNER) throw new BadRequestError("Você não tem permissão para esta operação")


                this.userService.addAccess(request.userEmail, access.board, request.accessType)
                logger.trace(`Permission granted`)
                return
            }
        }
        throw new BadRequestError("Quadro não está associado a usuário")
    }

    async removePermission(userEmail: string, request: PermissionRequest) {
        logger.trace(`Removing a permission for board ${request.boardId} for user ${request.userEmail}`)

        if (request.accessType) throw new BadRequestError("Parâmetro inválido: accessType")

        const user = await this.userService.getUser(userEmail)

        for (let access of user.accesses) {
            if (access.board as any == request.boardId) {
                if (access.type != AccessType.OWNER) throw new BadRequestError("Você não tem permissão para esta operação")

                await this.userService.removeAccess(request.userEmail, request.boardId)
                logger.trace(`Permission removed`)
                return
            }
        }
        throw new BadRequestError("Quadro não está associado a usuário")
    }

    async editBoard(userEmail: string, boardId: string, newInfo: NewBoardRequest) {
        logger.trace(`Editiong board ${boardId}`)

        const user = await this.userService.getUser(userEmail)

        for (let access of user.accesses) {
            if (access.board as any == boardId) {
                if (access.type != AccessType.OWNER) throw new BadRequestError("Você não tem permissão para esta operação")

                let oldBoard = await Board.findById(boardId)

                oldBoard!.title = newInfo.title
                oldBoard!.backgroundColor = newInfo.backgroundColor
                oldBoard!.textColor = newInfo.textColor

                logger.trace(`Board edited`)
                return oldBoard!.save()
            }
        }
        throw new BadRequestError("Quadro não está associado a usuário")
    }
}