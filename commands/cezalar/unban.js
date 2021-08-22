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

module.exports = class UNBan extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            description: "Kullanıcının banını açmaya yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "STRING",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "unban",
            category: "cezalar"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.banHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const user = interaction.options.getString('kullanıcı')
        if(!user) return interaction.reply({content: "Geçerli bir ID girmelisin."})
        const guild = client.guilds.cache.get(cfg.serverId)
        guild.members.unban(user);
        interaction.reply({content: `**${user}** ID'li kullanıcının banı başarılı şekile kaldırıldı.`})
    }
};