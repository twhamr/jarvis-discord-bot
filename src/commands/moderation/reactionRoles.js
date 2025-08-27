const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { fetchRecord, createRecord, deleteRecord } = require('../../handlers/cacheHandler');

module.exports = {
    name: 'reaction-roles',
    description: 'Manage your reaction roles system.',
    options: [
        {
            name: 'add',
            description: 'Add a new reaction role.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'message-id',
                    description: 'The message to react to.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'emoji',
                    description: 'The emoji to react with.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'role',
                    description: 'The role to give',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a reaction role.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'message-id',
                    description: 'The message to react to.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'emoji',
                    description: 'The emoji to react to.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
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
        const { options, guild, channel } = interaction;
        const sub = options.getSubcommand();
        const emoji = options.getString('emoji');
        
        const cacheFile = 'reactionRoles.json'

        try {
            const message = await channel.messages.fetch(options.getString('message-id'));

            const data = fetchRecord(cacheFile, {
                guild: guild.id,
                message: message.id,
                emoji: emoji
            });

            switch (sub) {
                case 'add':
                    if (data) {
                        return await interaction.reply({
                            content: `It looks like you already have this reaction setup using ${emoji} on this message.`,
                            flags: MessageFlags.Ephemeral
                        });
                    } else {
                        const role = options.getRole('role');
                        createRecord(cacheFile, {
                            guild: guild.id,
                            message: message.id,
                            emoji: emoji,
                            role: role.id
                        });

                        const embed = new EmbedBuilder()
                        .setDescription(`🫡 I have added a reaction role to ${message.url} with ${emoji} and the role ${role}.`)
                        .setColor('Blurple');

                        await message.react(emoji);

                        return await interaction.reply({
                            embeds: [embed],
                            flags: MessageFlags.Ephemeral
                        });
                    }
                case 'remove':
                    if (!data) {
                        return await interaction.reply({
                            content: `It doesn't look like that reaction role exists with ${emoji}.`,
                            flags: MessageFlags.Ephemeral
                        });
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

                        const embed = new EmbedBuilder()
                        .setDescription(`🫡 I have removed the reaction role from ${message.url} with ${emoji}.`)
                        .setColor('Blurple');

                        return await interaction.reply({
                            embeds: [embed],
                            flags: MessageFlags.Ephemeral
                        });
                    }
            }
        } catch (error) {
            return await interaction.reply({
                content: `❌ Unable to manage reaction roles: ${error}`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
}