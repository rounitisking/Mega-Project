// to deploy the code on the local server we use docker -- command -- [docker run --name mongodb -d -p 27017:27017 mongo]
// expres does not have fle handeling properties 

import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
dotenv.config({
    path : "../.env"
})

const port = process.env.PORT || 3000

connectDB().then(() => {
    console.log("db is connected")
    app.listen(port , ()=>{
        console.log(`the server is listening on port ${port}`)
    })
}).catch((err)=>{
    console.log("error occurred in importing the db in the index.js:", err)
})

