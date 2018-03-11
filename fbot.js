const Discord = require("discord.js");
const Commander = require('./helpers/commander.js');
const auth = require('./auth.json');

let client = new Discord.Client(),
    message,
    rankCounter = 0,
    membersArray;

client.on("ready", () => {
    console.log('Connected to Discord');
    client.user.setActivity('say: !help');
    // client.user.setAvatar('http://icons.veryicon.com/ico/Movie%20%26%20TV/Futurama%20Vol.%204%20-%20The%20Robots/Calculon.ico')
});

client.on("message", (message) => {
    if (!message.content.startsWith(auth.prefix) || message.author.bot) return;

    let commander = new Commander(message);

    switch (commander.baseCommand) {
        case 'help':
            message.channel.startTyping();
            commander.help()
            break;
        case 'stats':
            message.channel.startTyping();
            commander.pvpStats();
            break;
        case 'count':
            message.channel.startTyping();
            commander.countPlayers();
            break;
        case 'rankme':
            message.channel.startTyping();
            commander.rankPlayer();
            break;
        case 'rolldice':
            message.channel.startTyping();
            commander.rollDice();
            break;
        case 'platform':
            message.channel.startTyping();
            commander.setPlatform();
           break;
        case 'status':
            message.channel.startTyping();
            commander.getServerStatus();
            break;
        case 'pve':
            message.channel.startTyping();
            message.channel.send('```Разработва се!```').catch(console.error);
            break;
        case 'drop':
            message.channel.startTyping();
            commander.getDrop();
            break;
        case 'challenge':
            message.channel.startTyping();
            commander.challenge()
            break;
        // case 'rankall':
        //     if (!message.member.roles.has(allRanks.admins)) {
        //         message.channel.send('само за admin').catch(console.error);
        //         //
        //     } else {
        //         rankCounter = 0;
        //         membersArray = thisGuild.members.array();
        //         recursiveCount(rankCounter)
        //     }
        //     break;
        // default: //no because other bots are confusing this one
              // message.channel.send('"!stats" - to check your stats \n"!stats some_name" - to check someone elses stats').catch(console.error);
    }
    message.channel.stopTyping();
});

client.login(auth.token);
// https://discord.gg/n2VRFk
