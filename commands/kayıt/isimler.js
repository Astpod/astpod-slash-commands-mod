const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const Database = require("../../models/regData.js")
const Data = require("../../models/historyData.js")

module.exports = class İsimler extends Command {
    constructor(client) {
        super(client, {
            name: "isimler",
            description: "Kullanıcı'nın eski isimlerini görmeye yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "isimler",
            category: "kayıt"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.registerHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const member = interaction.options.getMember("kullanıcı")
        if(!member) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})

        Data.findOne({user: member.id}, async(err, res) => {
            if(!res) return interaction.reply({content: `${member} adlı kişinin geçmiş ismi bulunmuyor.`})
            const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(interaction.user.tag, interaction.user.avatarURL({dynamic: true}))
            .setDescription(`${member} adlı kişinin geçmiş isimleri \n\n${res.isimler.map(x => `•\`${x.isim}\` (${x.rol})`).join("\n")}`)
            interaction.reply({embeds: [embed]})
          });

        
    }
};