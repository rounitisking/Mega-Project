import express from "express"
import HealthCheckrouter from "./routers/healthCheck.routers.js";
import { healthcheck } from "./controller/healthCheck.controller.js";
const app = express()


app.use("api/v1/HealthCheck" , HealthCheckrouter)

export default app;