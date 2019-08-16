const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const headlineSchema = new Schema({
    Symbol: {type: String, require:true},
    NewsName: {type: String, require:true}
});

module.exports = mongoose.model("Headline", headlineSchema);