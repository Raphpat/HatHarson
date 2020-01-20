const {Client, RichEmbed} = require('discord.js');
const client = new Client();
const file = require('./auth.json');
//auth = JSON.parse(file);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("with JavaScript");
});

client.on('message', msg => {
    if (msg.author == client.user) { // Prevent bot from responding to its own messages
        return;
    }
    if (msg.content.startsWith("!")) {
        processCommand(msg);
    }
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
    //If the message is "how are you"
    if (msg.content.includes('how are you')) {
        msg.channel.send(`I\'m great, and how are you ${msg.author}?`);
    }
    /**if (msg.content.includes(client.user.username)){
        console.log(`I was tagged by ${msg.author.name}`);
    }**/
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
        msg.reply('I\'m great, aren\'t I!');
    }
    //Spread love with this message
    if (msg.content.includes('love')){ 
        msg.author.send("I love you too");
    }
});

client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find(ch => ch.name === 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
    member.send(`Welcome to ${member.guild.name}! I am active on this server. You can find out what I do by typing \`!help\``);
});

//Message for when a channel is created
client.on('channelCreate', channel => {
    if(channel.name = "undefined") return;
    
    const cha = client.channels.find(ch => ch.name === 'general');
    if (!cha) return;

    cha.send(`New channel created: \"${channel.name}\"`);
});

//Message for when a channel is deleted
client.on('channelDelete', channel => {
    const cha = client.channels.find(ch => ch.name === 'general');
    if (!cha) return;

    cha.send(`Channel deleted, goodbye \"${channel.name}\"`);
});

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I can:\n`!multiply [args]`\nI also react to phrases like 'how to embed',\
 'ping', 'how are you' and 'tada'");
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1 
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

client.login(file.token);