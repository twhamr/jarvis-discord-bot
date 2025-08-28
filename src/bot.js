require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { CommandKit } = require('commandkit');
const { devGuildIds, devUserIds } = require('../config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.User
    ]
});

new CommandKit({
    client,
    devGuildIds: devGuildIds,
    devUserIds: devUserIds,
    eventsPath: `${__dirname}/events`,
    commandsPath: `${__dirname}/commands`,
    bulkRegister: true
});

client.login(process.env.BOT_TOKEN);