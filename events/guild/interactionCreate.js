const Event = require("../../structures/EventClass");

const { Collection } = require("discord.js");

module.exports = class InteractionCreate extends Event {
    constructor(client) {
        super(client, {
            name: "interactionCreate",
            category: "interactions"
        });
    }
    async run(interaction) {
        const client = this.client;

        switch (true) {
            case interaction.isContextMenu():
            case interaction.isCommand(): {
                if (interaction.channel.type === "DM") return interaction.reply({ content: "Bu komutu sunucularda kullanabilirsiniz." });

                const command = client.commands.get(interaction.commandName);
                if (!command) return;

                if (!client.config.admins.includes(interaction.user.id)) {
                    const cooldown = client.cooldowns.get(interaction.user.id);
                    if (cooldown && Date.now() < cooldown) {
                        interaction.reply({ content: `Lütfen süreyi bekleyin **${command.name}** adlı komutu sonra tekrar deneyin!`, ephemeral: true });
                        break;
                    }
                    client.cooldowns.set(interaction.user.id, Date.now() + 1250);
                }

                try {
                    command.run(client, interaction);
                } catch (e) {
                    console.log(e);
                    return interaction.reply({ content: `An error has occurred.\n\n**\`${e.message}\`**` });
                }
                break;
            }
            case interaction.isSelectMenu():
            case interaction.isButton(): {
                if (interaction.user !== interaction.message.interaction.user) {
                    interaction.reply({ content: `x`, ephemeral: true });
                    break;
                }
            }
        }
    }
};