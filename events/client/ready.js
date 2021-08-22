const Event = require("../../structures/EventClass");
const CommandHandler = require("../../handler/Command");
const cfg = require("../../config")
const { CronJob } = require("cron")
const Database = require("../../models/limitData.js")
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: "ready",
            once: true
        });
    }
    async run() {
        const client = this.client;

        new CommandHandler(client).build("../commands").then(() => console.log(`Slash Commands Komutları ve Context Menüsü komutları yüklendi.`));

        const commands = await client.guilds.cache.get(client.config.serverId).commands.fetch();
        commands.filter(async (r) => {
            if (r.defaultPermission === false) {
                const permissions = [
                    {
                        id: client.config.adminRoleId,
                        type: "ROLE",
                        permission: true
                    },
                ];

                await r.permissions.set({ permissions });
            }
        });
        setInterval(() => {
            const reloadStatus = Math.floor(Math.random() * (cfg.status.length));
            client.user.setActivity(`${cfg.status[reloadStatus]}`);
        }, 60000)

        console.log(`Başarılı şekilde aktif oldu.`);

        const daily = new CronJob("00 00 00 * * *", () => {
            client.guilds.cache.forEach(async (guild) => {
              await Database.findOneAndUpdate({ guildID: guild.id }, { $set: { banLimit: 0, muteLimit: 0, vmuteLimit: 0, jailLimit: 0 } });
            });
          }, null, true, "Europe/Istanbul");
          daily.start();
   }
};