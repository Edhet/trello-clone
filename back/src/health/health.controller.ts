import { Get, Req, Res } from "@decorators/express";
import { Request, Response } from "express";
import { logger } from "../main";
import mongoose from "mongoose";

export class HealthController {
    constructor() { }

    @Get('/health')    
    async getHealth(@Req() req: Request, @Res() res: Response) {
        logger.trace("Returning request for health endpoint")
        return res.status(200).json({
            status: "UP",
            mongodb_connection_ready_state: mongoose.connection.readyState,
            timestamp: new Date()
        })
    }
}