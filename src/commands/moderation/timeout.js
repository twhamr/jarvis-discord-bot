const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'timeout',
    description: 'Timeout a user.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to timeout.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true
        },
        {
            name: 'duration',
            description: 'Timeout duration (30m, 1h, 1 day).',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the timeout.',
            type: ApplicationCommandOptionType.String
        }
    ],
    // choices: Function,
    // rolesRequired: Array[],
    permissionsRequired: [PermissionFlagsBits.MuteMembers],
    botPermissions: [PermissionFlagsBits.MuteMembers],
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const { options, guild } = interaction;

        const targetUserId = options.get('target-user').value;
        const duration = options.get('duration').value;
        const reason = options.get('reason')?.value || 'No reason provided';

        await interaction.deferReply();

        const targetUser = await guild.members.fetch(targetUserId);
        if (!targetUser) {
            await interaction.editReply('That user doesn\'t exist in this server.');
        }

        if (targetUser.id === guild.ownerId) {
            await interaction.editReply('You can\'t timeout that user because they\'re the server owner.');
        }

        if (targetUser.user.bot) {
            await interaction.editReply('You can\'t timeout a bot.');
        }

        const msDuration = ms(duration);

        if (isNaN(msDuration)) {
            await interaction.editReply('Please provide a valid timeout duration.');
        }

        if (msDuration < 5000 || msDuration > 2.419e9) {
            await interaction.editReply('Timeout duration cannot be less than 5 seconds or more than 28 days.');
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
        const botRolePosition = guild.members.me.roles.highest.position; // Highest role of the bot
        if (targetUserRolePosition >= requestUserRolePosition) {
            await interaction.editReply('You can\'t timeout that user because they have the same/higher role than you.');
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply('I can\'t timeout that user because they have the same/higher role than me.');
        }

        try {
            const { default: prettyMs } = await import('pretty-ms');
            
            if (targetUser.communicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
            }

            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
        } catch (error) {
            console.error(`❌ There was an error when timing out: ${error}`);
        }
    }
};