const { Client, Interaction } = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Pong!',
    // options: Object[],
    // choices: Function,
    // rolesRequired: Array[],
    // permissionsRequired: Array[],
    // botPermissions: Array[],
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        return await interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
};