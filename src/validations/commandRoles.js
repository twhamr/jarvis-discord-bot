const { MessageFlags } = require('discord.js');
const { fetchRecord } = require('../handlers/cacheHandler');

module.exports = async ({ interaction, commandObj, handler }) => {
    const { guild } = interaction;
    
    const data = fetchRecord('commandRoles.json', {
        guild: guild.id,
        command: commandObj.data.name
    })
    if (!data) return;

    if (!interaction.member.roles.cache.has(data.role)) {
        await interaction.reply({
            content: 'You don\'t have the role associated with this command.',
            flags: MessageFlags.Ephemeral
        });
        return true;
    }
};