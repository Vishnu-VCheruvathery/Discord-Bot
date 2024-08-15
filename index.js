import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import axios from 'axios';

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
       
    ] 
});

client.on('messageCreate', message => {
    if(message.author.bot) return;
    message.reply({
        content: 'Hi From Bot'
    });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;
    if (commandName === 'create') {
        const url = options._hoistedOptions[0].value;
        try {
            const response = await axios.post('https://url-shortner-0gw4.onrender.com/url', { url: url });

            // Assuming your API returns the shortened URL in the response
            const shortURL = response.data.id;

            await interaction.reply(`https://url-shortner-0gw4.onrender.com/${shortURL}`);
        } catch (error) {
            console.log(error)
            interaction.reply('Unable to create url');
        }
    } else if (commandName === 'weather') {
        const city = options._hoistedOptions[0].value;
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`);
            const weather = response.data.weather[0].main;
            const current_temp = (response.data.main.temp - 273.15).toFixed(2);
            const feels_like = (response.data.main.feels_like - 273.15).toFixed(2);
            const current_pressure = response.data.main.pressure;
            const humidity = response.data.main.humidity;
            interaction.reply(`
                ${city}:  
                Current Weather: ${weather},
                Current Temperature: ${current_temp}°C,
                Feels like: ${feels_like}°C,
                Pressure: ${current_pressure} hPa,
                Humidity: ${humidity}% 
            `);
        } catch (error) {
            console.log(error);
            interaction.reply('Unable to fetch weather');
        }
    } else if (commandName === 'ping') {
        await interaction.reply('pong');
    }else if (commandName === 'youtube') {
        const query = options.getString('query');
        
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: query,
                    key: process.env.GOOGLE_API_KEY,
                    maxResults: 1,  // You can adjust the number of results
                    type: 'video'
                }
            });

            const video = response.data.items[0];
            if (video) {
                const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId}`;
                await interaction.reply(`Here’s what I found: ${videoUrl}`);
            } else {
                await interaction.reply('No results found.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error searching for the video.');
        }
    }else if (commandName === 'search') {
        const query = options.getString('query');

        try {
            const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
                params: {
                    key: process.env.GOOGLE_API_KEY,
                    cx: process.env.SEARCH_ID,
                    q: query,
                },
            });

            const items = response.data.items;
            if (items && items.length > 0) {
                const firstResult = items[0];
                const title = firstResult.title;
                const link = firstResult.link;
                const snippet = firstResult.snippet;

                await interaction.reply(`**${title}**\n${snippet}\n${link}`);
            } else {
                await interaction.reply('No results found.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('Failed to perform search.');
        }
    }
});




client.login(process.env.AUTH_TOKEN);

