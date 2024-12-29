import AccessType from "./access-type.model"
import BoardInterface from "./board.model"

export default interface AccessInterface {
    type: AccessType
    favorite: boolean
    board: BoardInterface
}
