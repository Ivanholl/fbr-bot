const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');

const https = require('https');

client.on("ready", () => {
    console.log('Connected');
    client.user.setGame('!statshelp')
});
client.on("message", (message) => {
    var msgTemplate = new Discord.RichEmbed();
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    // var args = message.content.substring(1).split(' ');
    // var baseCommand = args[0];
    // var mode = args[1];
    var nick = message.author.lastMessage.member.nickname ? message.author.lastMessage.member.nickname : message.author.username;
    // console.log(nick);

    if (message.content.startsWith(config.prefix)) {
        switch(baseCommand) {
            case 'test2':
                getUserData(nick, sendMsg);
            break;
            case 'lookup':
                lookupPlayer(nick, sendMsg);
            break;

            case 'stats2':
                getUserData(nick, sendMsg);
                sendMsg('all')
            break;
            case 'stats2 duo':
            console.log('asd');
                // getUserData(nick, sendMsg);
                sendMsg('duo')
            break;
        /*    case 'statshelp2':
                message.channel.send('```To see your stats use: "!stats" \nTo see your duo stats type "!stats duo" \nTo see someone eles stats type "!stats <enter name here>" \nTo see someone elses duo stats type "!stats duo <enter name here>"```').catch(console.error);
            break;
            case 'count2':
                message.channel.send("Users in server: " + message.guild.memberCount).catch(console.error);
            break;
            case 'platform2':
                message.channel.send('yep').catch(console.error);
            break;*/
        }
    }

    function sendMsg(input){
        message.channel.send(input).catch(console.error);
    }
});
client.login(config.token);

function lookupPlayer(nick, callback){
    return https.get("https://api.partybus.gg/v1/players/lookup/" + nick, function(resp){
        resp.setEncoding('utf8');
        resp.on('data', function(chunk){
            callback()
        });
    }).on("error", function(e){
        console.log("Got error: " + e.message);
    });
}
function getUserData(nick, callback){
    return https.get("https://api.partybus.gg/v1/players/" + nick, function(resp){
        resp.setEncoding('utf8');
        resp.on('data', function(chunk){
            res = JSON.parse(chunk)
            playerStats = res.stats;
            prepareFormating(nick, playerStats, callback);
        });
    }).on("error", function(e){
        console.log("Got error: " + e.message);
    });
}

function prepareFormating(nick, playerStats, callback){
    if (playerStats == undefined) {
        callback('Fortnite user nor found. Please set your Discord nickname the same as in the game.');
    } else if(playerStats.length <= 0){
        lookupPlayer(nick, callback('Fortnite user added please wait 2min to see stats'));
    } else {
        callback(formatEmbeding(playerStats, nick));
    }
}

function formatEmbeding(playerStats, nick){
    var result = {
        embed: {
            color: 3447003,
            title: "All stats of Arelam",
            url: "https://partybus.gg/v1/players/" + nick,
            description: "Discord Fortnite Battle Royale stats tracking bot.",
            fields: [],
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: "!stats"
            }
        }
    }
    var topNames = [{type: "Solo", one : "Top 10",two : "Top 25" },{
                    type: "Squad", one : "Top 3", two : "Top 6" },{
                    type: "Duo", one : "Top 5", two : "Top 12"}]

    for (var i = 0; i < playerStats.length; i++) {
        var death = playerStats[i].games - playerStats[i].placeA;

        result.embed.fields.push({
            name: "============ " + topNames[i].type + " " + ((playerStats[i].kills / death).toFixed(2)+ " K/D (kills/death) ==============="),
            value: "."
        },{
            name: "Wins",
            value: playerStats[i].placeA,
            inline: true
        },{
            name: topNames[i].one,
            value: playerStats[i].placeB,
            inline: true
        },{
            name: topNames[i].two,
            value: playerStats[i].placeC,
            inline: true
        },{
            name: "Games",
            value: playerStats[i].games,
            inline: true
        },{
            name: "Win Rate",
            value: (playerStats[i].placeA / (playerStats[i].games / 100)).toFixed(2),
            inline: true
        },{
            name: "Kills",
            value: playerStats[i].kills,
            inline: true
        })
    }
    return result;
}
