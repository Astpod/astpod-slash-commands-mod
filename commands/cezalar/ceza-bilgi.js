const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const Datacık = require("../../models/limitData.js")
const Cezalarmı = require("../../models/ihlalData.js")

module.exports = class CezaBilgi extends Command {
    constructor(client) {
        super(client, {
            name: "ihlaller",
            description: "Kullanıcının ihlallerine bakmaya yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "ihlaller",
            category: "cezalar"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.jailHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})

        const Database = Cezalarmı.findOne({guildID: interaction.guild.id, userID: user.id})

        interaction.reply({content: `\`\`\`${user.user.tag} kullanıcısının ceza bilgileri aşağıda belirtilmiştir \n\nChat Mute: ${Database.mute ? Database.mute : 0} kez.\nSes Mute: ${Database.vmute ? Database.vmute : 0} Kez.\nCezalı Bilgisi: ${Database.jail ? Database.jail : 0} Kez.\nBan Bilgisi: ${Database.ban ? Database.ban : 0} Kez.\`\`\``})

    }
};