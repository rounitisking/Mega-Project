// ye ek higher order function hai - ek aisa fucntion jo ek dusre fucntion ko argument mai leta hai
// yaha request handeler ek controller function hai 
// hamne us controller fucntion ko ek wrapper fucntion mai dala hai tho jab controller route mai chalega tho vo ek wrapper fucntion ke andar chalega 
// promise.resolve -- Agar requestHandler ek synchronous function hai (normal function jo direct value return kare), to Promise.resolve() use ek resolved Promise me convert kar deta hai.
// .catch((err) => next(err)) ka kaam
// Normal async functions me agar await fail kare ya koi exception throw ho jaye, to Express use automatically catch nahi karta.
// Isliye humne .catch(next) likha hai.
// Ye error ko Express ke error handling middleware (jo (err, req, res, next) wala hota hai) me forward kar deta hai.
// Normally possible nahi hota, tu sahi bol raha hai — bina wrapper ke async error unhandledPromiseRejection ban jata hai.




const asyncHandeler = (requestHandeler)=>{
    return (req, res , next)=>{
        Promise.resolve(
            requestHandeler(req ,res, next).catch((err)=>next(err))
        )
    }
}

export default asyncHandeler