import { autoInjectable, injectable } from "tsyringe";
import { UserService } from "../user/user.service";

@injectable()
@autoInjectable()
export class BoardService { 
    
    constructor(private userService: UserService) { }

    async getUserBoards(username: string) {
        const user = await this.userService.getUser(username)
        user!.accesses
    }
}