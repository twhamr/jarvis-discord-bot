require('dotenv').config();
const getApplicationCommands = require('../../functions/getApplicationCommands');
const getLocalCommands = require('../../functions/getLocalCommands');

module.exports = async (client, args) => {
    try {
        const localCommands = getLocalCommands();
        
        let applicationCommands;
        if (process.env.DEV_ONLY) {
            applicationCommands = await getApplicationCommands(client, process.env.DEV_SERVER);
        } else {
            applicationCommands = await getApplicationCommands(client);
        }

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(
                (cmd) => cmd.name === name
            );

            if (existingCommand) {
                await applicationCommands.delete(existingCommand.id);
            }

            await applicationCommands.create({
                name,
                description,
                options
            });

            console.log(`👍 Registered command '${name}'.`);
        }
    } catch (error) {
        console.error(`❌ There was an error registering commands: ${error}`);
    }
};