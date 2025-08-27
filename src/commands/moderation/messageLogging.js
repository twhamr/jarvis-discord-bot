const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { fetchRecord, createRecord, deleteRecord } = require('../../handlers/cacheHandler');

module.exports = {
    name: 'message-logger',
    description: 'Manage your message logger system.',
    options: [
        {
            name: 'add',
            description: 'Add a message logger channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to log messages from.',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                },
                {
                    name: 'log-channel',
                    description: 'The channel to log messages to.',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a message logger channel.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to log messages from.',
                    type: ApplicationCommandOptionType.Channel,
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