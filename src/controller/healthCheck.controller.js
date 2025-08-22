// ye file hamne iss liye likha hai kyuki when we deploy our code on aws erver the server every 3 min sends a req and expect to geta response back so we write a file called as healthcheck which will give the res back to the server 
// here api response is a class 


import apiResponse from "../utils/api-response.js"

const healthcheck = async (req , res)=>{

   try {
     res.status(200).json(
          new apiResponse(200, {message : "yes the server is connected with db"})
                         )
         
   } catch (error) {
    console.log("error in healthcheck controller")
   }
    
}

export {healthcheck}