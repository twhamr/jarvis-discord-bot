const { Client, Interaction, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { directoryExist, readData } = require('../../handlers/fileHandler');

module.exports = {
    name: 'role-message',
    description: 'Generate role message.',
    // options: Object[],
    // choices: Function,
    // rolesRequired: Array[],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const templatesDir = directoryExist('templates');
        const embed = readData('rolesEmbed.json', templatesDir);

        const { channel } = interaction;

        await channel.send({ embeds: [embed] });
        return await interaction.reply({ content: 'Successfully created roles message.', flags: MessageFlags.Ephemeral });
    }
};