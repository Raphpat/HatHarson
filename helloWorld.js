const {Discord} = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
    //If the message is "how are you"
    if(msg.content === 'how are you') {
        msg.channel.send(`I'm great, and how are you ${msg.author}?`);
    }
    if (msg.content === 'what is my avatar') {
        // Trigger self conversation
        msg.channel.send('how are you');
    }
    // If the message is "how to embed"
    if (msg.content === 'how to embed') {
        // We can create embeds using the MessageEmbed constructor
        // Read more about all that you can do with the constructor
        // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
        const embed = new RichEmbed()
        // Set the title of the field
        .setTitle('A slick little embed')
        // Set the color of the embed
        .setColor(0xFF0000)
        // Set the main content of the embed
        .setDescription('Hello, this is a slick embed!');
        // Send the embed to the same channel as the message
        msg.channel.send(embed);
    }
    if (msg.content === "tada"){
        msg.reply("I'm great, aren't I!");
    }
});

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(ch => ch.name === 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});

client.login('NjY4NDI4MzY1NTg1NDQ4OTcx.XiRJZA.x5WtF_rlGhV-s6zhSBMC3CJN_5k');