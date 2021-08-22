const Command = require("../../structures/CommandClass");
const Client = require("../../structures/Client");
const { MessageActionRow, Message, MessageEmbed, MessageButton } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const ms = require("ms")
const Database = require("../../models/cezaData.js")
const Datacık = require("../../models/limitData.js")

module.exports = class UNMute extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            description: "Kullanıcının mutesini açmaya yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "unmute",
            category: "cezalar"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.muteHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})
        if (user.voice.serverMute == true) {
            user.voice.setMute(false)
            interaction.reply({content: `${user} adlı kullanıcının ses cezası kaldırılmıştır.`})
           } if (user.roles.cache.has(cfg.muted)) {
             user.roles.remove(cfg.muted)
            interaction.reply({content:`${user} adlı kullanıcının metin kanallarında ki susturulması kaldırılmıştır.`})
           }
    }
};