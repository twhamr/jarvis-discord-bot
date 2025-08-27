const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');
const { fetchRecord } = require('../../handlers/cacheHandler');

module.exports = async (client, args) => {
    let [message] = args;

    if (message.partial) {
        await message.fetch();
    }

    if (!message.guild || !message) return;
    var data = fetchRecord('messageLogging.json', {
        guild: message.guild.id,
        channel: message.channel.id
    });
    if (!data) return;

    var sendChannel = await message.guild.channels.fetch(data.logChannel);

    var b = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel('🗑️ Delete Message')
    .setCustomId('msglogdeletemsg')
    .setDisabled(false);

    var button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`)
        .setLabel('View Message'),

        b
    );

    var attachments = await message.attachments.map((attachments) => attachments.url).toString();

    var msg = await sendChannel.send({ content: `➡️ **New Message Logged - <#${data.channel}>** \n\n> ${message.content || 'No Message Content'}\n${attachments}\n\nThis message was sent by - ${message.author} (${message.author.id}) - and is being logged here. Take moderative action below if needed-- please note if some of the buttons don't work, it means the message has been deleted.`, components: [button] });

    var time = 300000; // 5 mins in ms

    const collector = await msg.createMessageComponentCollector({
        ComponentType: ComponentType.Button,
        time
    });

    await collector.on('collect', async (i) => {
        if (i.customId !== 'msglogdeletemsg') return;

        if (!message) return await msg.edit({ content: `➡️ **New Message Logged - <#${data.channel}>** \n\n> ${message.content || 'No Message Content'}\n${attachments}\n\nThis message was sent by - ${message.author} (${message.author.id}) - and is being logged here. **THIS MESSAGE HAS BEEN DELETED BY A MODERATOR OR THE MESSAGE AUTHOR**.`, components: [] }).catch((err) => {});
    
        var error;
        await message.delete().catch((err) => {
            error = true;
        });

        if (error) {
            await i.reply({ content: '⚠️ I could not delete that message.', flags: MessageFlags.Ephemeral });
        } else {
            await i.reply({ content: '🌎 I have deleted that message.', flags: MessageFlags.Ephemeral });
            await msg.edit({ content: `➡️ **New Message Logged - <#${data.channel}>** \n\n> ${message.content || 'No Message Content'}\n${attachments}\n\nThis message was sent by - ${message.author} (${message.author.id}) - and is being logged here. **THIS MESSAGE HAS BEEN DELETED BY THE MESSAGE LOG MODERATOR BUTTONS**.`, components: [] }).catch((err) => {});
        }
    });

    collector.on('end', async () => {
        await b.setDisabled(true);
        await msg.edit({ content: `➡️ **New Message Logged - <#${data.channel}>** \n\n> ${message.content || 'No Message Content'}\n${attachments}\n\nThis message was sent by - ${message.author} (${message.author.id}) - and is being logged here. **THE TIME HAS EXPIRED FOR MODERATIVE ACTION BELOW. YOU CAN STILL VIEW THE MESSAGE USING THE BUTTON-- IF IT DOESN'T WORK, IT MEANS THE MESSAGE WAS DELETED**.`, components: [button] }).catch((err) => {});
    });
};