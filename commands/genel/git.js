const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")

module.exports = class Git extends Command {
    constructor(client) {
        super(client, {
            name: "git",
            description: "Kullanıcının yanına gitmeye yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "git",
            category: "genel"
        });
    }
    async run(client, interaction) {
        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})
        if(!user.voice.channel) return interaction.reply({content: "Kullanıcı seste bulunmuyor."})
        
        const filter = (reaction, member) => {
            return ([cfg.noname, cfg.okname].includes(reaction.emoji.name) && member.id === user.id);
        };

        const astpod = new MessageEmbed()
        .setTitle(`Odaya gelme isteği`)
        .setDescription(`Merhaba ${user}. ${interaction.member} adlı üye bulunduğun sesli kanalına gelmek istiyor. \nBu mesaj balonunun altındaki tepkiler ile gelmesini veya gelmemesini sağlayabilirsin.`)
        .setColor("BLACK")

        let mesaj = await interaction.channel.send({content: `${user}`, embeds: [astpod]})

        await mesaj.react(cfg.ok);
        await mesaj.react(cfg.no);

        mesaj.awaitReactions({filter, max: 1, time: 60000, errors: ["time"] }).then(collected => {
        const reaction = collected.first();
        if (reaction.emoji.name === cfg.okname) {
        let kabul = new MessageEmbed()
        .setTitle(`Kabul`)
        .setDescription(`${interaction.member} adlı üye başarıyla ${user} adlı üyenin odasına taşındı.`)
        .setColor("BLACK")
        interaction.channel.send({embeds: [kabul]}).then(msg => { setTimeout(() => msg.delete(), 10000) })
        interaction.member.voice.setChannel(user.voice.channel);
        } else {
        let redd = new MessageEmbed()
        .setTitle(`Red`)
        .setDescription(`${user} adlı üye ${interaction.member} adlı kullanıcının gitme isteğini reddetti`)
        .setColor("BLACK")
        message.channel.send({embeds: [redd]}).then(msg => { setTimeout(() => msg.delete(), 10000) })
        }
        })


    }
};
