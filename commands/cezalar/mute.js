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
const Cezalar = require("../../models/ihlalData.js")

module.exports = class Mute extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            description: "Kullanıcıyı mutelemeye yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "mute",
            category: "cezalar"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.muteHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;
       
        let count = await Database.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;

        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})

        if(interaction.member.roles.highest.position <= user.roles.highest.position) return interaction.reply({content: "Kendinden büyük veya aynı roldeki kişileri muteliyemezsin."})
        if(user.id == interaction.member.id) return interaction.reply({content: "Kendini muteleyemezsin."})

        await Datacık.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.user.id }, { $inc: { muteLimit: 1 } }, { upsert: true });
        const Datasbu = await Datacık.findOne({guildID: interaction.guild.id, userID: interaction.user.id})

        if(Datasbu.muteLimit > cfg.muteLimit) return interaction.reply({content: "**Günlük chat mute limitin dolmuştur.**"})

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("1")
            .setLabel("1")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setCustomId("2")
            .setLabel("2")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setCustomId("3")
            .setLabel("3")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setCustomId("4")
            .setLabel("4")
            .setStyle("SECONDARY"),
            new MessageButton()
            .setCustomId("5")
            .setLabel("5")
            .setStyle("SECONDARY")
        )

        const m = await interaction.channel.send({content: `**1)** Küfür - 10DK.\n**2)** Ailevi Küfür - 15DK.\n**3)** Chat Troll - 20DK.\n**4)** Kışkırtma 25DK.\n**5)** Huzur Bozma - 25DK.`, components: [row] })

         const iFilter = i => i.user.id === interaction.member.id;

         const collector = m.createMessageComponentCollector({ filter: iFilter, time: 60000, max: 1})

         collector.on("collect", async (i) => {
             if(i.customId === "1") {
              await client.muted(user, interaction.member)
              await interaction.reply({content: `${cfg.ok} ${user} adlı kullanıcı **Küfür** sebebi ile ${interaction.member} adlı yetkili tarafından chat kanallarında mutelendi. (**Ceza Numarası:** \`[${count}]\`)`})
              await client.channels.cache.get(cfg.muteLog).send({content: `${cfg.ok} ${user} (**${user.user.tag}**) adlı üye **Küfür** ile \`${client.toDate(new Date())}\` tarihinde ${interaction.member} tarafından chat kanallarında mutelendi. [\`${count}\`]` })
              await client.delete(m)
            setTimeout(() => {
                client.unmuted(user, interaction.member)
            }, ms("10m"))
            } if(i.customId === "2") {
              await client.muted(user, interaction.member)
              await interaction.reply({content: `${cfg.ok} ${user} adlı kullanıcı **Ailevi Küfür** sebebi ile ${interaction.member} adlı yetkili tarafından chat kanallarında mutelendi. (**Ceza Numarası:** \`[${count}]\`)`})
              await client.channels.cache.get(cfg.muteLog).send({content: `${cfg.ok} ${user} (**${user.user.tag}**) adlı üye **Ailevi Küfür** ile \`${client.toDate(new Date())}\` tarihinde ${interaction.member} tarafından chat kanallarında mutelendi. [\`${count}\`]` })
              await client.delete(m)
              setTimeout(() => {
                  client.unmuted(user, interaction.member)
              }, ms("15m"))
             } if(i.customId === "3") {
                await client.muted(user, interaction.member)
                await interaction.reply({content: `${cfg.ok} ${user} adlı kullanıcı **Chat Troll** sebebi ile ${interaction.member} adlı yetkili tarafından chat kanallarında mutelendi. (**Ceza Numarası:** \`[${count}]\`)`})
                await client.channels.cache.get(cfg.muteLog).send({content: `${cfg.ok} ${user} (**${user.user.tag}**) adlı üye **Chat Troll** ile \`${client.toDate(new Date())}\` tarihinde ${interaction.member} tarafından chat kanallarında mutelendi. [\`${count}\`]` })
                await client.delete(m)
                setTimeout(() => {
                    client.unmuted(user, interaction.member)
                }, ms("20m"))
            } if(i.customId === "4") {
                await client.muted(user, interaction.member)
                await interaction.reply({content: `${cfg.ok} ${user} adlı kullanıcı **Kışkırtma** sebebi ile ${interaction.member} adlı yetkili tarafından chat kanallarında mutelendi. (**Ceza Numarası:** \`[${count}]\`)`})
                await client.channels.cache.get(cfg.muteLog).send({content: `${cfg.ok} ${user} (**${user.user.tag}**) adlı üye **Kışkırtma** ile \`${client.toDate(new Date())}\` tarihinde ${interaction.member} tarafından chat kanallarında mutelendi. [\`${count}\`]` })
                await client.delete(m)
                setTimeout(() => {
                    client.unmuted(user, interaction.member)
                }, ms("25m"))               
            } if(i.customId === "5") {
                await client.muted(user, interaction.member)
                await interaction.reply({content: `${cfg.ok} ${user} adlı kullanıcı **Huzur Bozma** sebebi ile ${interaction.member} adlı yetkili tarafından chat kanallarında mutelendi. (**Ceza Numarası:** \`[${count}]\`)`})
                await client.channels.cache.get(cfg.muteLog).send({content: `${cfg.ok} ${user} (**${user.user.tag}**) adlı üye **Huzur Bozma** ile \`${client.toDate(new Date())}\` tarihinde ${interaction.member} tarafından chat kanallarında mutelendi. [\`${count}\`]` })
                await client.delete(m)
                setTimeout(() => {
                    client.unmuted(user, interaction.member)
                }, ms("20m"))  
            }
         })
         await Cezalar.findOneAndUpdate({ guildID: interaction.guild.id, userID: user.id }, { $inc: { mute: 1, toplam: 1 } }, { upsert: true });
    }
};