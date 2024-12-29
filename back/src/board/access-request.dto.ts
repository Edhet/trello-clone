import AccessType from "../user/access-type.enum"

export default interface PermissionRequest {
    boardId: string
    userEmail: string
    accessType?: AccessType
}