const mongoose = require("mongoose")

const kayıts = new mongoose.Schema({
    guildID: String,
    userID: String,
    erkek: Number,
    kız: Number,
    toplam: Number
})

module.exports = mongoose.model("register", kayıts)