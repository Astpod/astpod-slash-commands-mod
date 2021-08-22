const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const Cezalarmı = require("../../models/cezaData.js")

module.exports = class Sicil extends Command {
    constructor(client) {
        super(client, {
            name: "sicil",
            description: "Kullanıcının siciline bakmaya yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "sicil",
            category: "cezalar"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.jailHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})
        Cezalarmı.find({guildID: interaction.guild.id, userID: user.id}, async (err, res) => {
        let listed = res.reverse();
        let History = listed.map((x, index) => `\`${index + 1}.\` **[${x.ceza}]** <@${x.yetkili}> (\`${x.yetkili}\`) tarafından **${x.sebep}** sebebiyle \`${client.toDate(x.tarih)}\` tarihinde cezalandırıldı. \`Ceza ID: (#${x.ihlal})\``).join("\n")
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(user.user.tag, user.user.avatarURL({dynamic: true}))
        .setDescription(`${user} kullanıcısının Ban-Jail bilgileri aşağıda belirtilmiştir.\n\n${History || "Kullanıcının sicili bulunmuyor."}`)
        interaction.reply({embeds: [embed]}) 
    })


    }
};