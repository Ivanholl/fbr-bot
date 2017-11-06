const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');

var https = require('https');

client.on("ready", () => {
    console.log('Connected');
    client.user.setGame('!statshelp')
});

client.on("message", (message) => {
    const msgTemplate = new Discord.RichEmbed();

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    //GuildMember.nickname
    var args = message.content.substring(1).split(' ');
    var baseCommand = args[0];

    var auhor = message.author;
    console.log("searched by " + auhor.tag);
    var authorId = message.author.id
    var nick = message.author.lastMessage.member.nickname ? message.author.lastMessage.member.nickname : message.author.username;
    var mode = args[1];
    // who are you checking
    var targetSearch = args[2] ? args[2] : nick;
    var iterator = 1;
    var iterModeFix = {
        all: 0,
        solo: 0,
        duo: 2,
        squad: 1
    };
    // console.log(message.author.tag) ime#1232
    // console.log(client.guilds);

    if (mode != "solo" && mode != "duo" && mode != "squad") {
        if (args[2] != undefined) {
            targetSearch = nick;
            mode = 'all';
            iterator = 3;
        } else {
            nick = mode;
            mode = 'all';
            iterator = 3;
        }
    } else {
        if (args[2] != undefined) {
            targetSearch = args[2];
        } else {
            targetSearch = nick;
        }
    }

    if (message.content.startsWith(config.prefix)) {
        switch(baseCommand) {
            case 'test':
                message.channel.send("some K/D").catch(console.error);
            break;
            case 'statskd':
                message.channel.send("yep").catch(console.error);
            case 'stats':
                lookupPlayer(mode);
            break;
            case 'statshelp':
                message.channel.send('```To see your stats use: "!stats" \nTo see your duo stats type "!stats duo" \nTo see someone eles stats type "!stats <enter name here>" \nTo see someone elses duo stats type "!stats duo <enter name here>"```').catch(console.error);
            break;
            case 'count':
                message.channel.send("Users in server: " + message.guild.memberCount).catch(console.error);
            break;
            case 'platform':
                message.channel.send('yep').catch(console.error);
            break;
        }
    }
    var playerStats;

    // function rankplayer(){
    //     https.get("https://api.partybus.gg/v1/players/" + nick, function(resp){
    //         resp.setEncoding('utf8');
    //         resp.on('data', function(chunk){
    //             // console.log(chunk);
    //             // console.log(typeof chunk.stats);
    //             res = JSON.parse(chunk)
    //             playerStats = res.stats;
    //             // console.log(playerStats);
    //             fillTemplate(mode);
    //         });
    //     }).on("error", function(e){
    //         console.log("Got error: " + e.message);
    //     });
    // }

    function lookupPlayer(mode){
        if (nick) {
            https.get("https://api.partybus.gg/v1/players/lookup/" + nick, function(resp){
                resp.setEncoding('utf8');
                resp.on('data', function(chunk){
                    getUserData(mode)
                });
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
        }
    }

    function getUserData(mode){
        if (nick) {
            https.get("https://api.partybus.gg/v1/players/" + nick, function(resp){
                resp.setEncoding('utf8');
                resp.on('data', function(chunk){
                    // console.log(chunk);
                    // console.log(typeof chunk.stats);
                    res = JSON.parse(chunk)
                    playerStats = res.stats;
                    // console.log(playerStats);
                    fillTemplate(mode);
                });
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
        }
    }


    function fillTemplate(mode){
        if (playerStats == undefined) {
            // console.log(playerStats);
            message.channel.send('Fortnite user nor found. Please set your Discord nickname the same as in the game.');
        } else if(playerStats.length <= 0){
            message.channel.send('Fortnite user added please wait 2min to see stats');
        } else {
            //0-solo 1-squad 2-duo
            msgTemplate.setTitle(mode + " stats of " + nick, "https://partybus.gg/player/")
                // .setTitle("``\nArelam's Fortnite Battle Royale Stats Tracker``")
                .setColor("#00AE86")//Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
                .setDescription("Discord Fortnite Battle Royale stats tracking bot.")
                .setFooter("!stats, !stats solo,!stats arelam, !stats solo arelam, !statskd", "")//footer
                // .setImage() //???
                // .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxnEUYgerxQz_8q130t7DjkdVWhN1JhpDXsjc7q9aYlF1Z-Tcj")//platform
                // .addBlankField(true)
                .setTimestamp()// Takes a Date object, defaults to current date.
                // .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")//???
                // .addField("This is a field title, it can hold 256 characters",
                // "This is a field value, it can hold 2048 characters.")//first title 256 long, second value it's 2048 long
                // .addField("Inline Field", "They can also be inline.", true)// Inline fields may not display as inline if the thumbnail and/or image is too big.
                // .addBlankField(true)// Blank field, useful to create some space.
                // .addField("Inline Field", "They can also be inline.", true)//up to 25 fields

                var modes = ["Solo", "Squad", "Duo"];
                var topNames = {
                    Solo : {
                        one : "Top 10",
                        two : "Top 25"
                    },
                    Squad : {
                        one : "Top 5",
                        two : "Top 12"
                    },
                    Duo : {
                        one : "Top 3",
                        two : "Top 6"
                    }
                }
                var forStop = iterator + iterModeFix[mode];
                // console.log(typeof forStop);
                for (var i = 0 + iterModeFix[mode]; i < forStop; i++) {
                    // console.log(i + "---" + iterator + iterModeFix[mode]);

                    var deaths = playerStats[i].games - playerStats[i].placeA;

                    msgTemplate.addField("============ " + modes[i] + "  " + Number((playerStats[i].kills / deaths).toFixed(2)) + " K/D (kills/death) ===============", "|")
                    //0.placeA
                    .addField("Wins", playerStats[i].placeA, true)
                    //0.placeB
                    .addField(topNames[modes[i]].one, playerStats[i].placeB, true)
                    //0.placeC
                    .addField(topNames[modes[i]].two, playerStats[i].placeC, true)
                    //games
                    .addField("Games", playerStats[i].games, true)
                    //wr
                    .addField("Win Rate", Number((playerStats[i].placeA / (playerStats[i].games / 100)).toFixed(2)), true)
                    //kills
                    .addField("Kills", playerStats[i].kills, true)
                    //minutes
                    // .addField("Time Played", Math.round(76 / 60), true)
                }
            console.log("=====");
            message.channel.send(msgTemplate).catch(console.error);
        }
    }
});
/*var options = {
    host: 'https://api.partybus.gg/v1/players/',
    family: 4,
    port: 443
};*/
client.login(config.token);
