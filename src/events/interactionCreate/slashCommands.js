const getLocalCommands = require('../../functions/getLocalCommands');
const { MessageFlags } = require('discord.js');

module.exports = async (client, args) => {
    let [interaction] = args;
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!commandObject) return;

        if (commandObject.rolesRequired?.length) {
            for (const role of commandObject.rolesRequired) {
                if (!interaction.member.roles.cache.has(role)) {
                    return await interaction.reply({
                        content: 'You don\'t have the role associated with this command.',
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }

        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    return await interaction.reply({
                        content: 'You don\'t have the permissions to run this command.',
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }

        if (commandObject.botPermissions?.length) {
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;

                if (!bot.permissions.has(permission)) {
                    return await interaction.reply({
                        content: 'I don\'t have the permissions to run this command.',
                        flags: MessageFlags.Ephemeral
                    });
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.error(`❌ There was an error running this command: ${error}`);
    }
}