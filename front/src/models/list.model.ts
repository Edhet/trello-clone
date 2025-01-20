import type { CardModel } from '@/models/card.model.ts'

export interface ListModel {
  _id: string
  title: string
  order: number
  cards?: CardModel[]
}
