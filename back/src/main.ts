import "reflect-metadata"
import express, { Express } from "express"
import cors from "cors";
import * as dotenv from "dotenv"
import { attachControllers, Container, ERROR_MIDDLEWARE } from "@decorators/express"
import { HealthController } from "./health/health.controller"
import mongoose from "mongoose"
import { Logger } from "tslog"
import { UserController } from "./user/user.controller"
import { ErrorHandler } from "./shared/middleware/error.middleware"
import { BoardController } from "./board/board.controller"
import { ListController } from "./lists/list.controller"
import { CardController } from "./card/card.controller"

const env = process.env.NODE_ENV
dotenv.config({ path: __dirname + `/.env.${env}` })

export const logger = new Logger({ name: "main", minLevel: env == "PRD" ? 5 : 0 })

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/trello-clone?authSource=${process.env.DB_USER}`)
mongoose.connection.on('error', (_error) => { logger.fatal(`Could not connect to mongodb server with mongoose`) })
mongoose.connection.on('connected', (_error) => { logger.info(`Connected to mongodb server with mongoose`) })
mongoose.connection.on('disconnected', (_error) => { logger.info(`Disconnect to mongodb server with mongoose`) })

const app: Express = express()
const port = process.env.PORT

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'], 
  credentials: true, 
}));

app.use(express.json())

attachControllers(app, [
  HealthController,
  UserController,
  BoardController,
  ListController,
  CardController
])

Container.provide([
  { provide: ERROR_MIDDLEWARE, useClass: ErrorHandler }
])

app.listen(port, () => {
  logger.info(`Server started on port: ${port}`)
})