import { model, Schema } from "mongoose"
import AccessInterface from "./access.model"

export interface UserInterface {
    email: string
    username: string
    password?: string
    accesses: AccessInterface[]
}

export const userSchema = new Schema<UserInterface>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    accesses: [{ type: Object }]
})

export const User = model<UserInterface>('User', userSchema)