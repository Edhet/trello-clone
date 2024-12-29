import { ErrorMiddleware } from "@decorators/express";
import { NextFunction, Request, Response } from "express";
import { logger } from "../../main";

export class ErrorHandler implements ErrorMiddleware {
  public use(error: Error, request: Request, response: Response, next: NextFunction) {
    logger.error(`${error.name}: ${error.message}`)
    logger.trace(error.stack)

    const msg = error.message ?? "Ocorreu um erro desconhecido"
    const statusCode = (error as any).STATUS_CODE ?? 500

    response.status(statusCode).json({ 
      status: statusCode,
      error: msg,
      timestamp: new Date()
    })
    next()
  }
}