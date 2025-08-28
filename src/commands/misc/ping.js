const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!'),

    options: {
        // devOnly: true,
        // userPermissions: [],
        // botPermissions: [],
        deleted: false
    },

    run: async ({ interaction, client, handler }) => {
        await interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
};