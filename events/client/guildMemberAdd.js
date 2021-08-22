const Event = require("../../structures/EventClass");
const CommandHandler = require("../../handler/Command");
const cfg = require("../../config")
const Database = require("../../models/cezaData.js")
const { joinVoiceChannel } = require("@discordjs/voice");
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

module.exports = class guildMemberAdd extends Event {
    constructor(client) {
        super(client, {
            name: "guildMemberAdd",
            once: true
        });
    }
    async run(member) {
        const client = this.client;

        if (Date.now() - member.user.createdTimestamp < ms("5d")) return setTimeout(() => { member.roles.set([cfg.şüpheli]) }, 3000)
        let cezalıDB = Database.findOne({ user: member.id })
        if(!cezalıDB) return member.roles.add(cfg.unregister)
        if (cezalıDB && cezalıDB.jail == true) return setTimeout(() => { member.roles.set([cfg.cezalı]) }, 3000)
   }
};