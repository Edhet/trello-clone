import BoardInterface from "../board/board.model"
import AccessType from "./access-type.enum"

export default interface AccessInterface {
    type: AccessType
    favorite: boolean
    board: BoardInterface
}
