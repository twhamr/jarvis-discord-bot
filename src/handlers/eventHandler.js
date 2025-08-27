const path = require('path');
const getAllFiles = require('../functions/getAllFiles');

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);
    
    for (const eventFolder of eventFolders) {
        try {
            const eventFiles = getAllFiles(eventFolder);
            eventFiles.sort((a, b) => a > b);

            const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();

            client.on(eventName, async (...args) => {
                for (const eventFile of eventFiles) {
                    const eventListener = require(eventFile);

                    await eventListener(client, args);
                }
            });
        } catch (error) {
            console.error(`❌ Error loading event ${eventName}: ${error}`);
        }
    }
};