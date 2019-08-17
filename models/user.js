const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Email: {type: String, require:true},
    Password: {type: String, require:true},
    Role: {type: String, default: "user"},
    PickedCoins: [String]
});

module.exports = mongoose.model("User", userSchema);