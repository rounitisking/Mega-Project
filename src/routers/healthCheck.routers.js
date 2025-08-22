import express, { Router } from "express"
import { healthcheck } from "../controller/healthCheck.controller.js";
const HealthCheckrouter = Router()

HealthCheckrouter.get("/Server" , healthcheck)
// HealthCheckrouter.route("/Server").get(healthcheck)
export default HealthCheckrouter;