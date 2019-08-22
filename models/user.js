// load dependencies
let mongoose = require("mongoose");             // mongoose
let bcrypt = require("bcrypt");                 // bcrypt

// hash salt
const bcryptSalt = 10;

// user model
let userSchema = mongoose.Schema({
    // local authentication
    local : {
        email : String,
        password : String
    },

    // facebook authentication
    facebook : {
        id : String,
        token : String,
        name : String,
        email : String
    },

    // twitter authentication
    twitter : {
        id : String,
        token : String,
        displayName : String,
        username : String
    },

    // google authentication
    google : {
        id : String,
        token : String,
        email : String,
        name : String
    },
    
    // common informaion
    role: String,
    selected: [String]
});

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(bcryptSalt));
}

// checking if the password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

// create the model for users
module.exports = mongoose.model("User", userSchema);

