const Command = require("../../structures/CommandClass");

const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")

module.exports = class Ses extends Command {
    constructor(client) {
        super(client, {
            name: "ses",
            description: "Sunucudaki sesteki kişileri sayar.",
            type: "CHAT_INPUT",
            usage: "sesli",
            category: "genel"
        });
    }
    async run(client, interaction) {
    if(!interaction.member.roles.cache.some(x => cfg.registerHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;
    
    let sesli = interaction.guild.members.cache.filter(x => x.voice.channel).size
    
    const embed = new MessageEmbed()
     .setAuthor(interaction.user.tag, interaction.user.avatarURL({dynamic: true}))
     .setColor("RANDOM")
     .setDescription(`\`>\` Sunucumuzda seste **${sesli}** kullanıcı bulunuyor.`)
      interaction.reply({ embeds: [embed] });
    }
};