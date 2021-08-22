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

module.exports = class UNJail extends Command {
    constructor(client) {
        super(client, {
            name: "unjail",
            description: "Kullanıcının jail cezasını açmaya yarar.",
            options: [
                {
                    name: "kullanıcı",
                    description: "Geçerli bir kullanıcı etiketlemelisin.",
                    type: "USER",
                    required: true,
                }
            ],
            type: "CHAT_INPUT",
            usage: "unjail",
            category: "cezalar"
        });
    }
    async run(client, interaction) {
        if(!interaction.member.roles.cache.some(x => cfg.jailHammer.includes(x.id)) && !interaction.member.permissions.has("MANAGE_ROLES")) return;

        const user = interaction.options.getMember("kullanıcı")
        if(!user) return interaction.reply({content: "Geçerli bir kullanıcı etiketlemelisin."})
        await Database.findOne({ user: user.id}, async (err, doc) => {
            if(!doc) return interaction.reply({content:`${user} veritabanında cezalı olarak bulunmuyor.`})
            if(doc.jail == false) return interaction.reply({content:`${user} veritabanında cezalı olarak bulunmuyor.`})
            doc.delete().catch(e => console.error(e))
            user.roles.cache.has(cfg.booster) ? user.roles.set([cfg.booster, cfg.unregister]) : user.roles.set([cfg.unregister]).catch(e => console.error(e))
            interaction.reply({content: `${user} adlı kişinin başarılı şekilde jail cezası kaldırıldı.`})
        })
    }
};