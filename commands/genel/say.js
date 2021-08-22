const Command = require("../../structures/CommandClass");

const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")

module.exports = class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Sunucudaki istatistikleri sayar.",
            type: "CHAT_INPUT",
            usage: "say",
            category: "genel"
        });
    }
    async run(client, interaction) {
    if(!interaction.member.roles.cache.some(x => cfg.registerHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;
    
    let tagli = interaction.guild.members.cache.filter(x => x.user.username.includes(cfg.tag)).size
    let aktif = interaction.guild.members.cache.filter(member => member.presence && (member.presence.status != "offline")).size
    let uye = interaction.guild.memberCount
    let sesli = interaction.guild.members.cache.filter(x => x.voice.channel).size
    
    const embed = new MessageEmbed()
     .setAuthor(interaction.user.tag, interaction.user.avatarURL({dynamic: true}))
     .setColor("RANDOM")
     .setDescription(`
\`>\` Sunucumuzda toplam **${uye}** üye bulunuyor.
\`>\` Sunucumuzda **${tagli}** taglı üye bulunuyor.
\`>\` Sunucumuzda **${aktif}** aktif üye bulunuyor.
\`>\` Sunucumuzda seste **${sesli}** kullanıcı bulunuyor.
`)
      interaction.reply({ embeds: [embed] });
    }
};