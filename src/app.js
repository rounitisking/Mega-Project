import express from "express"
import HealthCheckrouter from "./routers/healthCheck.routers.js";
import registerUserrouter from "../src/routers/auth.routers.js"
import { healthcheck } from "./controller/healthCheck.controller.js";
import dotenv from "dotenv"
import cors from "cors"
dotenv.config()
const app = express()

app.use(cors({
  origin : process.env.BASE_URL ,
  methods : ["GET" , "POST" ,"PUT" ,"DELETE"],
  credentials : true 
}))

app.use(express.json())
app.use(express.urlencoded())
app.use("/api/v1/HealthCheck" , HealthCheckrouter)
app.use("/api/v1/users" , registerUserrouter)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];
  const success = false;
  
  res.status(statusCode).json({ 
    statusCode, 
    success, 
    message, 
    errors 
  });
});

export default app;