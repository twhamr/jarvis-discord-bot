const { ActivityType } = require('discord.js');

module.exports = (c, client, handler) => {
    try {
        let status = [
            {
                name: 'Analyzing your every move...',
                type: ActivityType.Custom
            },
            {
                name: 'Processing vast amounts of data... and your messages.',
                type: ActivityType.Custom
            },
            {
                name: 'Your personal AI butler, at your service.',
                type: ActivityType.Custom
            },
            {
                name: 'Upping your game, one calculation at a time.',
                type: ActivityType.Custom
            },
        ]

        setInterval(() => {
            let random = Math.floor(Math.random() * status.length);
            c.user.setActivity(status[random]);
        }, 10000);

        return true;
    } catch (error) {
        console.error(`❌ Unable to set Bot status: ${error}`);
    }
};