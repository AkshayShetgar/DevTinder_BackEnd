const validator = require("validator");


const signupValidation = (req) => {
   const {firstName, lastName, emailId, password} = req.body;
   if(!firstName || !lastName){
    throw new Error("Name is not valid");
   }
   else if(!validator.isEmail(emailId)){ 
    throw new Error("Email is not valid");
   }
   else if(!validator.isStrongPassword(password)){
    throw new Error("Enter a strog password");
   }
};

const validateProfileData = (req) => {
   const allowdFields = ["firstName", "lastName", "gender", "about", "skills", "photoUrl", "age"];
   const isAllowed = Object.keys(req.body).every((key) => allowdFields.includes(key));
   return isAllowed;
}

module.exports = {signupValidation, validateProfileData};