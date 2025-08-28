require('dotenv').config();
const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { postRequest } = require('../../functions/httpRequests');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('jarvis')
    .setDescription('Chat with JARVIS!')
    .addStringOption(
        (option) => option.setName('message').setDescription('Your message to JARVIS.').setRequired(true)
    ),
    
    options: {
        // devOnly: true,
        // userPermissions: [],
        // botPermissions: [],
        deleted: false
    },

    run: async ({ interaction, client, handler }) => {
        const { options } = interaction;
        const message = options.getString('message');

        await interaction.deferReply();

        try {
            const host = 'http://192.168.1.157:8080';
            const endpoint = '/api/chat/completions';
            const body = {
                model: 'jarvis',
                messages: [
                    {
                        role: 'user',
                        content: `${message}`
                    }
                ]
            };
            const headers = {
                'Authorization': `Bearer ${process.env.OLLAMA_TOKEN}`,
                'Content-Type': 'application/json'
            };

            const res = await postRequest(host + endpoint, body, headers);

            await interaction.editReply({ content: res.choices[0].message.content }).catch((err) => {});
        } catch (error) {
            await interaction.editReply({ content: `❌ Unable to generate response!: ${error}`, flags: MessageFlags.Ephemeral });
        }
    }
};