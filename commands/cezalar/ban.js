const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const Database = require("../../models/cezaData.js")
const Datacık = require("../../models/limitData.js")
const Cezalarmı = require("../../models/ihlalData.js")

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            description: "Kullanıcıyı banlamaya yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                },
                {
                    name: "sebep",
                    description: "Geçerli bir sebep yazmalısın.",
                    type: "STRING",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "ban",
            category: "cezalar"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.banHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;
       
        let count = await Database.countDocuments().exec();
        count = count == 0 ? 1 : count + 1;

        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})

        if(interaction.member.roles.highest.position <= user.roles.highest.position) return interaction.reply({content: "Kendinden büyük veya aynı roldeki kişileri banlıyamazsın."})
        if(user.id == interaction.member.id) return interaction.reply({content: "Kendini banlıyamazsın."})
        
        const reason = interaction.options.getString("sebep")
        if(!reason) return interaction.reply({content: "Geçerli bir sebep yazmalısın"})

        await Datacık.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.user.id }, { $inc: { banLimit: 1 } }, { upsert: true });
        const Datasbu = await Datacık.findOne({guildID: interaction.guild.id, userID: interaction.user.id})

        if(Datasbu.banLimit > cfg.banLimit) return interaction.reply({content: "**Günlük ban limitin dolmuştur.**"})

        interaction.reply({content: `${cfg.ok} ${user} adlı kullanıcı **${reason}** sebebi ile ${interaction.member} adlı yetkili tarafından banlandı. (**Ceza Numarası:** \`[${count}]\`)`})
        
        user.ban({reason: `Yetkili : ${interaction.user.tag} | Sebep: ${reason}`})

        client.channels.cache.get(cfg.banLog).send({content: `${cfg.ok} ${user} (**${user.user.tag}**) adlı üye **${reason}** ile \`${client.toDate(new Date())}\` tarihinde ${interaction.member} tarafından yasaklandı. [\`${count}\`]`})

        const Data = new Database({
            user: user.id,
            yetkili: interaction.member.id,
            ihlal: count,
            ceza: "BAN",
            sebep: reason,
            tarih: new Date()
        })
        Data.save().catch(e => console.error(e))
        
        await Cezalarmı.findOneAndUpdate({ guildID: interaction.guild.id, userID: user.id }, { $inc: { ban: 1, toplam: 1 } }, { upsert: true });
        
    }
};