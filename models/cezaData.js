const mongoose = require("mongoose")

const ceza = new mongoose.Schema({
    user: String,
    ihlal: Number,
    yetkili: String,
    ceza: String,
    tarih: String,
    bitiş: String,
    sebep: String,
    puan: Number,
    guild: String,
    jail: { type: Boolean, default: false},
    mute: { type: Boolean, default: false}
})

module.exports = mongoose.model("cezalar", ceza)