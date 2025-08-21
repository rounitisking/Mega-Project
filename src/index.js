import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
dotenv.config({
    path : "..  /.env"
})

const port = 3000 || process.env.PORT 

connectDB().then(
    app.listen(port , ()=>{
    console.log(`the server is listening on port ${port}`)
})).catch((err)=>{
    console.log("error occured in importing the db in the index.js")
})

