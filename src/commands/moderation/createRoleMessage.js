const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { directoryExist, readData } = require('../../handlers/fileHandler');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('role-message')
    .setDescription('Generate role message.'),

    options: {
        // devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false
    },
    
    run: async ({ interaction, client, handler }) => {
        const templatesDir = directoryExist('templates');
        const embed = readData('rolesEmbed.json', templatesDir);

        const { channel } = interaction;

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: 'Successfully created roles message.', flags: MessageFlags.Ephemeral });
    }
};