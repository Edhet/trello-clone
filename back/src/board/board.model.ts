import { model, Schema } from "mongoose"
import { ListInterface } from "../lists/list.model"

export default interface BoardInterface {
    _id?: string
    title: string
    backgroundColor: string
    textColor: string
    lists: ListInterface[]
}

export const boardSchema = new Schema<BoardInterface>({
    title: { type: String, required: true },
    backgroundColor: { type: String, required: true },
    textColor: { type: String, required: true },
    lists: [{
        title: { type: String, required: true },
        order: { type: Number, required: true },
        cards: [{
            priority: { type: Number, required: true },
            content: { type: String, required: true }
        }]
     }]
})

export const Board = model<BoardInterface>('Board', boardSchema)
