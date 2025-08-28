const { SlashCommandBuilder, EmbedBuilder, ChannelType, MessageFlags } = require('discord.js');
const { fetchRecord, createRecord, deleteRecord } = require('../../handlers/cacheHandler');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('message-logger')
    .setDescription('Manage your message logger system.')
    .addSubcommand(
        (command) => command
                     .setName('add')
                     .setDescription('Add a message logger channel.')
                     .addChannelOption(
                        (option) => option.setName('channel').setDescription('The channel to log messages from.').addChannelTypes(ChannelType.GuildText).setRequired(true)
                     )
                     .addChannelOption(
                        (option) => option.setName('log-channel').setDescription('The channel to log messages to.').addChannelTypes(ChannelType.GuildText).setRequired(true)
                     )
    )
    .addSubcommand(
        (command) => command
                     .setName('remove')
                     .setDescription('Remove a message logger channel.')
                     .addChannelOption(
                        (option) => option.setName('channel').setDescription('The channel to log messages from.').addChannelTypes(ChannelType.GuildText).setRequired(true)
                     )
    ),
    
    options: {
        // devOnly: true,
        userPermissions: ['Administrator'],
        botPermissions: ['Administrator'],
        deleted: false
    },

    run: async ({ interaction, client, handler }) => {
        const { options, guild } = interaction;
        const sub = options.getSubcommand();
        var channel = options.getChannel('channel');
        
        const cacheFile = 'messageLogging.json'

        var data = fetchRecord(cacheFile, {
            guild: guild.id,
            channel: channel.id
        });

        async function sendMessage(message) {
            const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(message);

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        try {
            switch (sub) {
                case 'add':
                    if (data) {
                        await sendMessage(`⚠️ It looks like the message log system is already setup for that channel.`);
                    } else {
                        var logChannel = options.getChannel('log-channel');

                        createRecord(cacheFile, {
                            guild: guild.id,
                            channel: channel.id,
                            logChannel: logChannel.id
                        })

                        await sendMessage(`🌎 The message logger system is now enabled for ${channel}! All messages will be logged into ${logChannel}`);
                    }
                break;
                case 'remove':
                    if (!data) {
                        await sendMessage('⚠️ There is no message log system for that channel.');
                    } else {
                        deleteRecord(cacheFile, data.id);

                        await sendMessage(`🌎 I have disabled the message log system for ${channel}.`);
                    }
                break;
            }
        } catch (error) {
            await sendMessage(`❌ Unable to manage message logging: ${error}`);
        }
    }
};