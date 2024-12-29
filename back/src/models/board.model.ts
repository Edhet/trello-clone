import ListInterface from "./list.model"

export default interface BoardInterface {
    id: string
    lists: ListInterface[]
}
