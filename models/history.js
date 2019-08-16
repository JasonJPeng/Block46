const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema({
    Id: {type: String, require:true},
    Symbol: {type: String, require:true},
    HistoryTimestamp: [Number],
    HistoryPriceUSD: [Number]
});

module.exports = mongoose.model("History", historySchema);
