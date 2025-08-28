const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const getApplicationCommands = require('../../functions/getApplicationCommands');
const { fetchRecord, createRecord, deleteRecord } = require('../../handlers/cacheHandler');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('command-roles')
    .setDescription('Manage your command roles system.')
    .addSubcommand(
        (command) => command
                     .setName('add')
                     .setDescription('Add a role to a command.')
                     .addStringOption(
                        (option) => option.setName('command').setDescription('The command to add a role to.').setRequired(true)
                     )
                     .addRoleOption(
                        (option) => option.setName('role').setDescription('The role required to run command.').setRequired(true)
                     )
    )
    .addSubcommand(
        (command) => command
                     .setName('remove')
                     .setDescription('Remove a role from a command.')
                     .addStringOption(
                        (option) => option.setName('command').setDescription('The command to remove a role from.').setRequired(true)
                     )
    )
    .addSubcommand(
        (command) => command
                     .setName('fetch')
                     .setDescription('Fetch the role required for a command.')
                     .addStringOption(
                        (option) => option.setName('command').setDescription('The command to fetch.').setRequired(true)
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
        const command = options.getString('command');
        
        const cacheFile = 'commandRoles.json';

        try {
            const applicationCommands = await getApplicationCommands(client);

            const targetCommand = applicationCommands.cache.find(
                (cmd) => cmd.name === interaction.commandName
            );
            if (!targetCommand) return;

            
            const data = fetchRecord(cacheFile, {
                guild: guild.id,
                command: targetCommand.name
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
                        await sendMessage(`⚠️ It looks like you already have this role assigned to this command.`);
                    } else {
                        const role = options.getRole('role');
                        createRecord(cacheFile, {
                            guild: guild.id,
                            command: targetCommand.name,
                            role: role.id
                        });

                        await sendMessage(`⚡ I have added the role ${role} to the command *${command}*.`);
                    }
                break;
                case 'remove':
                    if (!data) {
                        await sendMessage(`⚠️ It doesn't look like there are any roles assigned to this command.`);
                    } else {
                        deleteRecord(cacheFile, data.id);

                        await sendMessage(`⚡ I have unassigned the role from the command *${command}*.`);
                    }
                break;
                case 'fetch':
                    if (!data) {
                        await sendMessage('⚠️ There are no roles associated with this command.');
                    } else {
                        const role = await guild.roles.fetch(data.role);

                        await sendMessage(`🔎 The role ${role.name} is required to run the command *${command}*.`);
                    }
                break;
            }
        } catch (error) {
            await sendMessage(`❌ Unable to manage command roles: ${error}`);
        }
    }
};