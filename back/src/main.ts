import express, { Express } from "express"
import * as dotenv from "dotenv"
import { attachControllers } from "@decorators/express"
import { HealthController } from "./controllers/health.controller"

dotenv.config({ path: __dirname+`/.env.${process.env.NODE_ENV}`})

const app: Express = express()
const port = process.env.PORT

app.use(express.json())

attachControllers(app, [
  HealthController
])

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})