// here we are using mailgen which is used for crating the mail and here we are using the nodemailer which is used for sending the mail
// here in the name it will be name of the email
// link mai vo hoga jispe user click karega
// ham ekfactory fucntion banayenge jismai ham ye karenge ki email ka jo option hai maitalba email ka content vo sab ham ek method se kr paye 
// ham first priority html ko dete hai fir agar vo nhi jata tho ham text mai bhejte hai -- tho yaha ek email do data leke jate hai b


import Mailgen from "mailgen";
import nodemailer from "nodemailer"

//factory fucntion 
const EmailOption = function (body , outro){  /// here body is a object 
        return {
        name: body.name,
        intro: body.intro,
        
        instructions: body.instructions,
        
        color: body.color, // Optional action button color
         text: body.text,
        link: body.link,
        
        
        Outro : outro
    }
}



const sendMail = async (emailOptions, Useremail , subject)=>{

    // this code is for setting up and configuring Mailgen with a theme and product details.
    var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        
        name: 'task manager',
        link: 'https://mailgen.js/'
        
    }
});

var emailContent = {
    body: {
        name: emailOptions.name, // here it will be name of the user to which the email is sending
        intro: emailOptions.intro,
        action: {
            instructions: emailOptions.instructions,
            button: {
                color: emailOptions.color, // Optional action button color
                text: emailOptions.text,
                link: emailOptions.link
            }
        },
        outro: emailOptions.Outro
    }
};


var emailText = mailGenerator.generatePlaintext(emailContent);
let emailHtml = mailGenerator.generate(emailContent)

// creating a transported in nodemail 
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: process.env.MAILTRAP_SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PWD,
  },
});

// sending the mail 
const SendMail = async ()=>{
    try {
        await transporter.sendMail({
            from: process.env.MAILTRAP_SENDER_EMAIL,
            to: Useremail,
            subject: subject,
            text: emailText,
            html: emailHtml
        });
        
        console.log("Message sent successfully");
        return true;
    } catch (error) {
        console.log("error occurred while sending the mail:", error.message);
        return false;
    }
}

try {
    return await SendMail();
} catch (error) {
    console.log("error occurred while sending the mail:", error.message);
    return false;
}

}


export {sendMail , EmailOption }