import mongoose, { model, Schema } from "mongoose"
import ListInterface from "../lists/list.model"

export default interface BoardInterface {
    backgroundColor: string
    textColor: string
    lists: ListInterface[]
}

export const boardSchema = new Schema<BoardInterface>({
    backgroundColor: { type: String, required: true },
    textColor: { type: String, required: true },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }]
})

export const Board = model<BoardInterface>('Board', boardSchema)
