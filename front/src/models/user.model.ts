import type { AccessType } from '@/models/access-type.enum.ts'

export interface UserInterface {
  _id?: string
  email: string
  username: string
  password?: string
  accesses: {
    _id: string
    type: AccessType
    favorite: boolean
    board: string
  }
}
