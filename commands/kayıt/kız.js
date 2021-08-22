const Command = require("../../structures/CommandClass");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const cfg = require("../../config")
const moment = require("moment")
require("moment-duration-format");
moment.locale("tr")
const Database = require("../../models/regData.js")
const Data = require("../../models/historyData.js")

module.exports = class Kız extends Command {
    constructor(client) {
        super(client, {
            name: "k",
            description: "Kullanıcıyı kayıt etmeye yarar..",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                },
                {
                    name: "isim",
                    description: "Geçerli bir isim yazmalısın.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "yaş",
                    description: "Geçerli bir yaş yazmalısın.",
                    type: "NUMBER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "k",
            category: "kayıt"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.registerHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const member = interaction.options.getMember("kullanıcı")
        if(!member) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})

        if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply({content: "Kendinden büyük veya aynı roldeki kişileri kayıt edemezsin."})
        
        const isims = interaction.options.getString("isim")
        if(!isims) return interaction.reply({content: "Geçerli bir isim yazmalısın"})

        const yaşs = interaction.options.getNumber("yaş")
        if(!yaşs) return interaction.reply({content: "Geçerli bir yaş yazmalısın"})

        const niyk = member.user.username.includes(cfg.tag)
        if(niyk) await member.setNickname(`${cfg.tag} ${isims} | ${yaşs}`)
        else await member.setNickname(`${cfg.tagsıztag} ${isims} | ${yaşs}`)

        if(!member.roles.cache.has(cfg.kız)) {
            setTimeout(() => {
                member.roles.add(cfg.kız)          
         }, 1000);
        await member.roles.remove(cfg.unregister)
        }
        interaction.reply({content: `${cfg.ok} ${member} adlı kişi başarılı şekilde **Bayan** olarak kayıt edildi.`})

        Data.findOne({user: member.id}, async(err,res) => {
            if(!res) {
              let arr = []
              arr.push({isim: member.displayName, rol: cfg.kız, yetkili: interaction.member.id})
              let newData = new Data({
                user: member.id,
                isimler: arr
              })
              newData.save().catch(e => console.log(e))
              } else {
              res.isimler.push({isim: member.displayName, rol: cfg.kız, yetkili: interaction.member.id})
              res.save().catch(e => console.log(e))
            }
        })
        
        await Database.findOneAndUpdate({ guildID: interaction.guild.id, userID: interaction.user.id }, { $inc: { kız: 1, toplam: 1 } }, { upsert: true });
        
    }
};