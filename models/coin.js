const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coinSchema = new Schema({
    Id: {type: String, require:true},
    Symbol: {type: String, require:true},
    Name: String,
    ImageUrl: String,
    Source: String
});

module.exports = mongoose.model("Coin", coinSchema);
