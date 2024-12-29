import { model, Schema } from "mongoose"
import { CardInterface } from "../card/card.model"

export interface ListInterface {
    _id?: string
    title: string
    order: number
    cards: CardInterface[]
}

export const listSchema = new Schema<ListInterface>({
    title: { type: String, required: true },
    order: { type: Number, required: true },
    cards: [{ type: Schema.ObjectId, ref: 'Card' }]
})

export const List = model<ListInterface>('List', listSchema)