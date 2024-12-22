import { Get, Req, Res } from "@decorators/express";
import { Request, Response } from "express";

export class HealthController {

    constructor() { }

    @Get('/health')    
    async getHealth(@Req() req: Request, @Res() res: Response) {
        return res.status(200).json({
            status: "UP",
            timestamp: new Date()
        })
    }
}