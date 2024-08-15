import { REST, Routes, ApplicationCommandOptionType } from 'discord.js';
import 'dotenv/config';
const commands = [
    {
            name: 'ping',
            description: 'Replies with pong',
        
    },
    {
        name: 'create',
        description: 'Creates a new short URL',
        options: [
            {
                name: 'url',
                type: ApplicationCommandOptionType.String, // Correct usage
                description: 'The URL you want to shorten',
                required: true,
            },
        ],
    },
    {
        name: 'weather',
        description: 'Check current weather',
        options: [
            {
                name: 'city',
                type: ApplicationCommandOptionType.String,
                description: "The city whose weather you want to know",
                required: true
            }
        ]
    },
    {
        name: 'youtube',
        description: 'Searches YouTube for a video',
        options: [
            {
                name: 'query',
                type: ApplicationCommandOptionType.String,
                description: 'The search query',
                required: true,
            },
        ],
    },
    {
        name: 'search',
        description: 'Search the web using Google',
        options: [
            {
                name: 'query',
                type: ApplicationCommandOptionType.String,
                description: 'The search query',
                required: true,
            },
        ],
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.AUTH_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
      
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

