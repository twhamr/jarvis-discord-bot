const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { fetchRecord, createRecord, deleteRecord } = require('../../handlers/cacheHandler');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reaction-roles')
    .setDescription('Manage your reaction roles system.')
    .addSubcommand(
        (command) => command
                     .setName('add')
                     .setDescription('Add a new reaction role.')
                     .addStringOption(
                        (option) => option.setName('message-id').setDescription('The message to react to.').setRequired(true)
                     )
                     .addStringOption(
                        (option) => option.setName('emoji').setDescription('The emoji to react with.').setRequired(true)
                     )
                     .addRoleOption(
                        (option) => option.setName('role').setDescription('The role to assign.').setRequired(true)
                     )
    )
    .addSubcommand(
        (command) => command
                     .setName('remove')
                     .setDescription('Remove an existing reaction role.')
                     .addStringOption(
                        (option) => option.setName('message-id').setDescription('The message to react to.').setRequired(true)
                     )
                     .addStringOption(
                        (option) => option.setName('emoji').setDescription('The emoji to react with.').setRequired(true)
                     )
    ),
    
    options: {
        // devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false
    },
    
    run: async ({ interaction, client, handler }) => {
        const { options, guild, channel } = interaction;
        const sub = options.getSubcommand();
        const emoji = options.getString('emoji');
        
        const cacheFile = 'reactionRoles.json';

        try {
            const message = await channel.messages.fetch(options.getString('message-id'));

            const data = fetchRecord(cacheFile, {
                guild: guild.id,
                message: message.id,
                emoji: emoji
            });

            async function sendMessage(message) {
                const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setDescription(message);

                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            }

            switch (sub) {
                case 'add':
                    if (data) {
                        await sendMessage(`⚠️ It looks like you already have this reaction setup using ${emoji} on this message.`);
                    } else {
                        const role = options.getRole('role');
                        createRecord(cacheFile, {
                            guild: guild.id,
                            message: message.id,
                            emoji: emoji,
                            role: role.id
                        });

                        await message.react(emoji);

                        await sendMessage(`🫡 I have added a reaction role to ${message.url} with ${emoji} and the role ${role}.`);
                    }
                break;
                case 'remove':
                    if (!data) {
                        await sendMessage(`⚠️ It doesn't look like that reaction role exists with ${emoji}.`);
                    } else {
                        const users = await message.reactions.cache.get(emoji).users.fetch();
                        
                        for (const user of users.values()) {
                            const member = guild.members.cache.get(user.id);
                            if (member && member.roles.cache.has(data.role)) {
                                await member.roles.remove(data.role);
                            }

                            await message.reactions.cache.get(emoji).remove(user);
                        }

                        deleteRecord(cacheFile, data.id);

                        await sendMessage(`🫡 I have removed the reaction role from ${message.url} with ${emoji}.`);
                    }
                break;
            }
        } catch (error) {
            await sendMessage(`❌ Unable to manage reaction roles: ${error}`);
        }
    }
}