module.exports = (c, client, handler) => {
    console.log(`🤖 ${c.user.tag} is online and ready!`);
    return true;
};