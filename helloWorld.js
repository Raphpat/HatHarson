const {Client, RichEmbed} = require('discord.js');
const client = new Client();
const auth = require('./auth.json');
const fs = require('fs');
var swear = require('./ressources/swearWords.json');

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
    if (swear.status && checkWords(msg)){
        deleteMessage(msg);
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

/**
 * Process received message for a command
 * @param {*} receivedMessage Original message
 */
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
    } else if (primaryCommand == "toggleCensorship"){
        toggleCensorship(arguments, receivedMessage);
    } else if (primaryCommand == "censor"){
        censor(arguments, receivedMessage);
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
}

/**
 * Help function
 * @param {*} arguments prints out message with argument at end
 * @param {*} receivedMessage Original message
 */
function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I can:\n`!multiply [args]`\nI also react to phrases like 'how to embed',\
 'ping', 'how are you' and 'tada'");
    }
}

/**
 * Multiplies arguments
 * @param {*} arguments Array of numbers to be multiplied
 * @param {*} receivedMessage Original message
 */
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

/**
 * Toggle censorship on/off
 * @param {*} arguments 
 * @param {*} receivedMessage Original message
 */
function toggleCensorship(arguments, receivedMessage){
    if(swear.status == false){
        swear.status = true;
        
        console.log("censorhip set to true");
    } else{
        swear.status = false;
        console.log("censorhip set to false");
    }
    fs.writeFileSync('./ressources/swearWords.json', JSON.stringify(swear));
}

/**
 * Censor last messages
 * @param {*} arguments nothing much
 * @param {*} receivedMessage Original message
 */
function censor(arguments, receivedMessage){
    receivedMessage.channel.fetchMessages({ limit: 10 })
    .then(messages => censorArray(messages.array()))
    .catch(console.error);
}

/**
 * Check words in a message for swear words
 * @param {*} msg message to check
 * @return true if there is a swear word
 */
function checkWords(msg){
    for(j = 0; j < swear.words.length; j++){
        if(msg.content.includes(swear.words[j])){
            deleteMessage(msg);
            break;
        }
    }
}

/**
 * For each message, check if it contains a swear word
 * @param {*} arr Array of messages
 */
function censorArray(arr){
    console.log("got to censorArray, " + arr.length);
    for(i = 0; i < arr.length; i++){
        checkWords(arr[i]);
        console.log(arr[i].content);
    }
    arr[0].channel.send("No swear words ;)");
}

/**
 * Delete a message
 * @param {*} msg Message to be deleted
 */
function deleteMessage(msg){
    msg.delete();
    console.log(`Deleted message from ${msg.author.username}`);
    msg.channel.send('You swore', {files: ["./ressources/consuela.jpg"]});
}

client.login(auth.token);