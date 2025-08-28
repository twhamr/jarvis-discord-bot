const { fetchRecord } = require('../../handlers/cacheHandler');

module.exports = async (reaction, user, details, client, handler) => {
    if (reaction.partial) {
        await reaction.fetch();
    }
    
    if (!reaction.message.guildId) return;
    if (user.bot) return;

    let cID = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
    if (!reaction.emoji.id) cID = reaction.emoji.name;

    const data = fetchRecord('reactionRoles.json', {
        guild: reaction.message.guildId,
        message: reaction.message.id,
        emoji: cID
    });
    if (!data) return;

    const guild = await client.guilds.cache.get(reaction.message.guildId);
    const member = await guild.members.cache.get(user.id);

    try {
        await member.roles.add(data.role);
        console.log(`➕ The role ${data.role} was given to ${user.tag}.`);
    } catch (error) {
        console.log(`❌ An error occurred giving the role ${data.role} to ${user.tag}: ${error}.`);
    }
};