const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kicks a user from this server.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to kick.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason you want to kick the user.',
            type: ApplicationCommandOptionType.String
        }
    ],
    // choices: Function,
    // rolesRequired: Array[],
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const { options, guild } = interaction;

        const targetUserId = options.get('target-user').value;
        const reason = options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await guild.members.fetch(targetUserId);
        if (!targetUser) {
            await interaction.editReply('That user doesn\'t exist in this server.');
        }

        if (targetUser.id === guild.ownerId) {
            await interaction.editReply('You can\'t kick that user because they\'re the server owner.');
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
        const botRolePosition = guild.members.me.roles.highest.position; // Highest role of the bot
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply('You can\'t kick that user because they have the same/higher role than you.');
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply('I can\'t kick that user because they have the same/higher role than me.');
        }

        try {
            await targetUser.kick({ reason });
            await interaction.editReply(`User ${targetUser} was kicked\nReason: ${reason}`);
        } catch (error) {
            console.error(`❌ There was an error when kicking: ${error}`);
        }
    }
};