import { model, Schema } from "mongoose"
import AccessType from "./access-type.enum"
import BoardInterface from "../board/board.model"

export interface AccessInterface {
    _id?: string
    type: AccessType
    favorite?: boolean
    board: BoardInterface
}

export interface UserInterface {
    _id?: string
    email: string
    username: string
    password?: string
    accesses: AccessInterface[]
}

export const userSchema = new Schema<UserInterface>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    accesses: [{
        type: { type: String, enum: Object.values(AccessType), required: true },
        favorite: { type: Boolean, default: false, required: true },
        board: { type: Schema.ObjectId, ref: 'Board' },
    }]
})

export const User = model<UserInterface>('User', userSchema)