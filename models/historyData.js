const mongoose = require("mongoose")

const historys = new mongoose.Schema({
    guildID: String,
    userID: String,
    isimler: Array
})

module.exports = mongoose.model("isimler", historys)