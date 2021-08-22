const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")

module.exports = class Çek extends Command {
    constructor(client) {
        super(client, {
            name: "çek",
            description: "Kullanıcınıyı yanına çekmeye yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "çek",
            category: "genel"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.transportHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})

        if(!user.voice.channel) return interaction.reply({content: "Kullanıcı seste bulunmuyor."})


        interaction.reply({content: `${user} adlı kişiyi başarılı şekilde yanınıza çektiniz.`})

    }
};