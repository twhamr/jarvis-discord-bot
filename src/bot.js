require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

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

if (process.env.DEV_ONLY.toLowerCase() === 'true') {
    console.log('⚙️ Development mode is active.. Only refreshing commands for DEV server!');
} else {
    console.log('🚀 Development mode is inactive.. Commands are available globally!');
}

eventHandler(client);

client.login(process.env.BOT_TOKEN);