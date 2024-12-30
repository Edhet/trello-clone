import { CardInterface } from "../card/card.model"

export interface ListInterface {
    _id?: string
    title: string
    order: number
    cards: CardInterface[]
}