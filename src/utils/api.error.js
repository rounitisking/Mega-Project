// we are making a custome error class from a extension of a error class
//Agar tumhari class kisi dusri class ko extend (inherit) kar rahi hai, to super() ka use hota hai.
// Matlab child class ka constructor run hone se pehle parent class ka constructor run karna zaruri hota hai
// Error class ek built-in parent class hai JavaScript me.
// Uska constructor ek message leta hai jo error ke description ke liye hota hai.
// Jab tum super(message) likhte ho, toh tum parent (Error) ke constructor ko woh message de rahe ho.
// stack ek list deta hai ki code kahan-kahan chala aur exactly kis line pe error aaya.
// stack ek "error ka map" hai jo dikhata hai ki program kahan-kahan se guzra jab tak error aaya. Debugging me help karta hai.




class apiError extends Error{

    constructor(
        statuscode ,
        message = "something went wrong",
        errors =[],
        stack = ""
    ){
        super(message);
        this.statuscode = statuscode;
        this.message = message;
        this.success = false;
        this.errors = errors;
       
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this ,this.constructor)
        }
    }
    

}
export {apiError}
