const Discord = require("discord.js");
const Commander = require('./helpers/commander.js');
const auth = require('./auth.json');
const request = require("request-promise");

const FCrawler = require('./helpers/crawler.js')
var crawler = new FCrawler();

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

    if (commander.checkNickname()) {
        return;
    }

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
        case 'season':
            message.channel.startTyping();
            // commander.challenge()
            crawler.test()
            message.channel.send('разработва се').catch(console.error);
            break;
        // case 'sendall':
        //     if (!message.member.roles.has("376004135230636053")) {
        //         message.channel.send('само за admin').catch(console.error);
        //     } else {
        //         commander.sendAll();
        //     }
        //     break;
        // case 'rankall':
        //     if (!message.member.roles.has("376004135230636053")) {
        //         message.channel.send('само за admin').catch(console.error);
        //         //
        //     } else {
        //         // rankCounter = 0;
        //         // membersArray = thisGuild.members.array();
        //         commander.countPlayers();
        //     }
        //     break;
            // case 'test':
            // request({
            //     url: 'https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/stats/accountId/cd842a7777d641b592adaeaa22805f6b/bulk/window/alltime',
            //     headers: {
            //     'Authorization': "basic " + auth.token
            //     },
            //     'method': 'POST',
            //     json: true
            // })
            // .then((data) => {
            // console.log(data);
            // })
            // .catch((err) => {
            //     console.log(err);
            // });
            // commander.getStatsBRFromID()
        // break;
        // default: //no because other bots are confusing this one
              // message.channel.send('"!stats" - to check your stats \n"!stats some_name" - to check someone elses stats').catch(console.error);
    }

    message.channel.stopTyping();
});

client.login(auth.token);
// https://discord.gg/n2VRFk
