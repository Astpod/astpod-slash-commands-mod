const mongoose = require("mongoose")

const limitler = new mongoose.Schema({
    guildID: String,
    userID: String,
    banLimit: Number,
    muteLimit: Number,
    vmuteLimit: Number,
    jailLimit: Number
})

module.exports = mongoose.model("limits", limitler)