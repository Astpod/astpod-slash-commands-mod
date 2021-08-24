const Client = require("./structures/Client");
require("dotenv").config();
const cfg = require("./config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const mongoose = require("mongoose")
mongoose.connect(cfg.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

const client = new Client();
client.login();

client.toDate = date => {
    return new Date(date).toLocaleString("tr-TR", { hour12: false, timeZone: "Europe/Istanbul"}).replace(",", "");
};
 
client.format = sure => {
    return moment.duration(sure).format("D [gün,] H [saat,] m [dakika,] s [saniye.]");
};

client.muted = async (user, staff) => {
    await user.roles.add(cfg.muted)
}

client.unmuted = async (user, staff) => {
    await user.roles.remove(cfg.muted)
}

client.vmuted = async (user, staff) => {
    await user.voice.setMute(true)
}

client.unvmuted = async (user, staff) => {
    await user.voice.setMute(false)
}

client.delete = async(msg) => {
    await msg.delete()
}  
  
 
client.moment = sure => {
    return moment(sure).format("HH:mm:ss");
};

client.getDate = (date, type) => {
    let sure;
    date = Number(date);
    if (type === "saniye") { sure = (date * 1000) }
    else if (type === "dakika") { sure = (60 * 1000) * date }
    else if (type === "saat") { sure = ((60 * 1000) * 60) * date }
    else if (type === "gün") { sure = (((60 * 1000) * 60) * 24) * date }
    else if (type === "hafta") { sure = ((((60 * 1000) * 60) * 24) * 7) * date }
    else if (type === "ay") { sure = ((((60 * 1000) * 60) * 24) * 30) * date }
    else if (type === "yıl") { sure = ((((((60 * 1000) * 60) * 24) * 30) * 12) + 5) * date };
    return sure;
};

process.on('uncaughtException', err => console.error(err.stack));
process.on('unhandledRejection', err => console.error(err.stack));
