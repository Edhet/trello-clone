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
    lists: [{ type: Schema.ObjectId, ref: 'List' }]
})

export const Board = model<BoardInterface>('Board', boardSchema)
