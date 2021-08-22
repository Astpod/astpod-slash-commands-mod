const Command = require("../../structures/CommandClass");

const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = class UserInfo extends Command {
    constructor(client) {
        super(client, {
            name: "Kullanıcı Bilgisi",
            type: "USER",
            defaultPermission: true,
            contextDescription: "Kullanıcı bilgisi.",
            category: "Context",
            cooldown: 5,
            enabled: true,
            staffOnly: false,
            permissions: ["Use Application Commands", "Send Messages", "Embed Links"]
        });
    }
    async run(client, interaction) {
        const member = interaction.guild.members.cache.get(interaction.targetId);

        const embed = new MessageEmbed()
            .setTitle(`**${member.user.username}#${member.user.discriminator}**`)
            .setColor(client.config.embedColor)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
            .addFields(
                {
                    name: "👤 Kullanıcı Bilgisi",
                    value: stripIndents`
                        **ID:** ${member.user.id}
                        **Oluşturma Tarihi:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:d>
                        `,
                    inline: true
                },
                {
                    name: "📋 Kullanıcı'nın Diğer Bilgileri",
                    value: stripIndents`
                        **Sunucuya Giriş tarihi:** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>
                        **Kullanının ismi:** ${member.nickname || `Varsayılan`}
                        **Rolü:** ${member.roles.hoist ? member.roles.hoist.name : "Bulunmuyor."}
                        `,
                    inline: true
                },
                {
                    name: `📝 Rolleri [${member.roles.cache.size - 1}]`,
                    value: member.roles.cache.size ? member.roles.cache.map(roles => `**${roles}**`).slice(0, -1).join(" ") : "None",
                    inline: false
                }
            );

        interaction.reply({ embeds: [embed] });
    }
};