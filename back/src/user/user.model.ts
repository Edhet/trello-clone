import { model, Schema } from "mongoose"
import AccessInterface from "../models/access.model"

export interface UserInterface {
    username: string
    password?: string
    accesses: AccessInterface[]
}

export const userSchema = new Schema<UserInterface>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accesses: [{ type: String }]
})

export const User = model<UserInterface>('User', userSchema)