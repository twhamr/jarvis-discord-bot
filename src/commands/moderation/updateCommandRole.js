const { Client, Interaction, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const getApplicationCommands = require('../../functions/getApplicationCommands');

module.exports = {
    name: 'command-roles',
    description: 'Manage your command roles system.',
    options: [
        {
            name: 'add',
            description: 'Add a role to a command',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'command',
                    description: 'The command to add a role to.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'role',
                    description: 'The role required to run command.',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a role from a command.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'command',
                    description: 'The command to remove a role from.',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'role',
                    description: 'The role to unassign. Leave blank to unassign all roles.',
                    type: ApplicationCommandOptionType.Role
                }
            ]
        },
        {
            name: 'fetch-roles',
            description: 'List the roles required to run a command.',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'command',
                    description: 'The command to fetch.',
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
        const { options } = interaction;
        const command = options.getString('command');
        const role = options.getRole('role');
    }
};