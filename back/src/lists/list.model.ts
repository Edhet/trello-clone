import { CardInterface } from "./card.model"

export interface ListInterface {
    _id?: string
    title: string
    order: number
    cards: CardInterface[]
}