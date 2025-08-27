require('dotenv').config();
const { Client, Interaction, ApplicationCommandOptionType, MessageFlags } = require('discord.js');
const { postRequest } = require('../../functions/httpRequests');

module.exports = {
    name: 'jarvis',
    description: 'Chat with JARVIS!',
    options: [
        {
            name: 'message',
            description: 'Your message to JARVIS.',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    // choices: Function,
    rolesRequired: [
        '1406450680184569897'
    ],
    // permissionsRequired: Array[],
    // botPermissions: Array[],
    
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
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