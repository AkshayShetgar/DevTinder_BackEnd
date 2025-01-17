const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email adress");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    isPremium : {
      type : Boolean,
      default : false,
    },
    photoUrl: {
      type: String,
      validate(value){
        if(!validator.isURL(value)){
            throw new Error('Invalid photo URL');
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
      minLength : 10,
    },
    lastSeen : {
      type : String,
      default : null,
    },
  },
  { timestamps: true }
);

userSchema.index({firstName : 1, lastName : 1});

const User = mongoose.model("User", userSchema);

module.exports = User;
