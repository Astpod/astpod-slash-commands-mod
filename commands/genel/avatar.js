const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const Cezalarmı = require("../../models/cezaData.js")

module.exports = class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Kullanıcının avatarına bakmaya yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "avatar",
            category: "genel"
        });
    }
    async run(client, interaction) {
        if(interaction.channel.id !== cfg.botkomut) return interaction.reply({content: "Bu komutu bot komut kanalında kullanmalısın."})
        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})
        let avatar = user.user.avatarURL({ dynamic: true, size: 2048 });
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(user.user.tag, user.user.avatarURL({dynamic: true}))
        .setDescription(`${user} kullanıcısının avatarı.`)
        .setImage(avatar)
        interaction.reply({embeds: [embed]})

    }
};