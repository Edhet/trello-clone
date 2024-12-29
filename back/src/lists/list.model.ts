import { CardInterface } from "../card/card.model"

export default interface ListInterface {
    id: string
    order: number
    cards: CardInterface[]
}
