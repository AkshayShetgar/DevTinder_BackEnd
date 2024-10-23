const mongoose  = require("mongoose");

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true, 
        minLength : 4,
        maxLength : 30,
    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        min : 18,
    },
    gender : {
        type : String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gendrr data is not valid");
            }
        }
    },
    photoUrl : {
        type : String,
    },
    about : {
        type : String,
    },
    skills : {
        type : [String],
    },
},{timestamps : true});

const User = mongoose.model("User", userSchema);

module.exports = User;