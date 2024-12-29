import { model, Schema } from "mongoose"

export interface CardInterface {
    priority: number
    content: string
}

export const cardSchema = new Schema<CardInterface>({
    priority: { type: Number, required: true },
    content: { type: String, required: true }
})

export const Card = model<CardInterface>('Card', cardSchema)

