import type { ListModel } from '@/models/list.model.ts'
import type { AccessType } from '@/models/access-type.enum.ts'

export interface BoardAccessModel {
  _id?: string
  type: AccessType
  favorite: boolean
  board: BoardModel
}

export interface BoardModel {
  _id: string
  title: string
  backgroundColor: string
  textColor: string
  lists: ListModel[]
}
