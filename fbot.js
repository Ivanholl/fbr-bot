const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const emptySpace ="ᅠ";//empty space
// const fs = require('fs');
const randomColor = require('randomcolor');
const imageBuilder = require('./imageBuilder.js');

const Fortnite = require('./node_modules/fortnite-api');
let fortniteAPI = new Fortnite(["ivan.jelev@abv.bg", "1q2w3e4r5t", "MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=v", "ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ="]);

fortniteAPI.login()
.then((stats) => {
        console.log("logged in Fortnite");
    })
    .catch((err) => {
        console.log("not logged in Fortnite");
    });

const allRanks = {
    checked: '392744795149172738',
    rank0 : {
        id: '376054967103913984',
        name : "Rank Unranked",
        kd: [0, 0.5]
    },
    rank1 : {
        id: '376004191300091904',
        name : "Rank 1",
        kd: [0.5, 1.5]
    },
    rank2 : {
        id: '376004340986413058',
        name : "Rank 2",
        kd: [1.5, 3.0]
    },
    rank3 : {
        id: '376039937843265537',
        name : "Rank 3",
        kd: [3.0, 5.0]
    },
    rank4 : {
        id: '393039424226590722',
        name : "Rank Legendary",
        kd: [5.0, 100]
    }
}

/*const myRolesID = {
    checked: '392744795149172738',
    Unranked: '376054967103913984',
    Rank1: '376004191300091904',
    Rank2 : '376004340986413058',
    Rank3 : '376039937843265537',
    RankLegendary: '393039424226590722'
}*/

// var https = require('https');

var hexColor = randomColor();
var embedColor = randomColor({
   format: 'rgbArray',
   alpha: 0.5
});
var intColor = Math.floor(Math.random()*16777215);
var playerStats = {};

client.on("ready", () => {
    console.log('Connected to Discord');
    client.user.setGame('!helpstats');
    // client.user.setAvatar('http://icons.veryicon.com/ico/Movie%20%26%20TV/Futurama%20Vol.%204%20-%20The%20Robots/Calculon.ico')
});

client.on("message", (message) => {
    // const msgTemplate = new Discord.RichEmbed();

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    var thisGuild = message.guild;

    var args = message.content.substring(1).split(' ');
    var baseCommand = args[0];
    var searchedName;
    if (args[1]) {
        args.shift()
        searchedName = args.join(' ');
    }

    // console.log(searchedName);

    var auhor = message.author; //message.author.id;
    var nick = auhor.lastMessage.member.nickname ? auhor.lastMessage.member.nickname : auhor.username;
    var targetSearch = searchedName != undefined ? searchedName : nick; // who are you checking

    if (message.content.startsWith(config.prefix)) {

        console.log("Searched by " + auhor.tag + "|nick: " + nick + " |target: " + targetSearch);
        // message.channel.send('спряна').catch(console.error);

        switch(baseCommand) {
            case 'helpstats':
                message.channel.send(
                    '!stats - връща вашите статовe' +
                    '\n!stats some_name - връща статовете на някой' +
                    '\n!count - показва колко хора има в сървъра и по колко са от ранк' +
                    '\n!rankme - проверява вашето K/D и ви слага ранк' +
                    '\n!news - дава новините за Fortnite' +
                    '\n!status - показва дали са Online server-ите за Fortnite' +
                    '\n!drop - избира ви случайно място да паднете'
                ).catch(console.error);
            break;
            case 'stats':
                fortniteAPI.getStatsBR(targetSearch, 'pc')
                    .then((stats) => {
                        // console.log(stats);
                        fillTemplate(stats)
                    })
                    .catch((err) => {
                        console.log(err);
                        message.channel.send(err).catch(console.error);
                });
            break;
            case 'count':
                countMembers();
            break;
            case 'rankme':
                fortniteAPI.getStatsBR(targetSearch, "pc")
                    .then((stats) => {
                        rankPlayer(stats)
                    })
                    .catch((err) => {
                        console.log('err');
                        message.channel.send(err).catch(console.error);
                });
            break;
            case 'news':
                lang = targetSearch;
                fortniteAPI.getFortniteNews(lang)
                    .then((news) => {
                        sendNews(news.br)
                    })
                    .catch((err) => {
                        console.log(err);
                        message.channel.send(err).catch(console.error);
                    });
            break;
            case 'status':
                fortniteAPI.checkFortniteStatus()
                    .then((serverStatus) => {
                        if (serverStatus) {
                            message.channel.send('Fortnite Servers are Online').catch(console.error)
                        } else {
                            message.channel.send('Fortnite Servers are Offline').catch(console.error)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        message.channel.send(err).catch(console.error)
                    });
            break;
            case 'drop':
                message.channel.send(dropMe()).catch(console.error);
            break;
        /*    case 'test':
                fortniteAPI.getStatsBR(targetSearch, 'pc')
                    .then((stats) => {
                        // console.log(stats);
                        fillTemplate2(stats)
                    })
                    .catch((err) => {
                        console.log(err);
                        message.channel.send(err).catch(console.error);
                });
            break;
            /*case 'lookup':
                // message.channel.send('спряна команда').catch(console.error);
                fortniteAPI.lookup(targetSearch)
                    .then((stats) => {
                        console.log(stats)
                        // message.channel.send(stats).catch(console.error)
                    })
                    .catch((err) => {
                        console.log(err);
                        // message.channel.send(err).catch(console.error)
                    });
            break;
            default:
                message.channel.send('"!stats" - to check your stats \n"!stats some_name" - to check someone elses stats').catch(console.error);*/
        }
    }

    function countMembers(){
        var buildString = "```md\n[Total users in server:](" + thisGuild.memberCount + ")";

        function getRoleMembers(thisGuild, input){
            var res = thisGuild.roles.get(input['id'])
            buildString += "\n" + pad(input['name'] + ": ", 11)  + pad((thisGuild.memberCount * res.members.size / 100) + "% - ", 6) + res.members.size + " users.";
        }

        getRoleMembers(thisGuild, allRanks.rank0);
        getRoleMembers(thisGuild, allRanks.rank1);
        getRoleMembers(thisGuild, allRanks.rank2);
        getRoleMembers(thisGuild, allRanks.rank3);
        getRoleMembers(thisGuild, allRanks.rank4);

        buildString += "\n```";

        message.channel.send(buildString).catch(console.error);
    }
    /*https://api.partybus.gg/v1/players/lookup/"*/

    /*function getUserData(){
        if (targetSearch) {
            https.get("https://api.partybus.gg/v1/players/" + encodeURI(targetSearch.toLowerCase()), function(resp){
                resp.setEncoding('utf8');
                resp.on('data', function(chunk){
                    var res = JSON.parse(chunk);
                    if (!res.message) {
                        playerStats = res.stats;
                        playerStats.details = res.details;
                        fillTemplate();
                    } else {
                        message.channel.send(res.message).catch(console.error);
                    }
                });
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
        }
    }*/
    function rankPlayer(stats){
        let kd = Math.max(stats.group.solo['k/d'], stats.group.duo['k/d'], stats.group.squad['k/d']);

        switch (true) {
            case (kd < allRanks.rank0.kd[0]):
                setRole(allRanks.rank0.id, allRanks.rank1, kd);
                break;
            case (kd > allRanks.rank1.kd[0] && kd < allRanks.rank1.kd[1]):
                setRole(allRanks.rank1.id, allRanks.rank2, kd);
                break;
            case (kd > allRanks.rank2.kd[0] && kd < allRanks.rank2.kd[1]):
                setRole(allRanks.rank2.id, allRanks.rank3, kd);
                break;
            case (kd > allRanks.rank3.kd[0] && kd < allRanks.rank3.kd[1]):
                setRole(allRanks.rank3.id, allRanks.rank4, kd);
                break;
            case (kd > allRanks.rank4.kd[1]):
                setRole(allRanks.rank4.id, allRanks.rank4, kd);
                message.channel.send('```css\nБрат ти си легенда!!!1!!111!1!```' + thisGuild.roles.get(allRanks.rank4.id));
                break;
            default:
                setRole(allRanks.rank0.id, allRanks.rank0.id);
        }
    }

    function setRole(role, nextRole, kd) {
        if(!message.member.roles.has(role)) {
            message.member.removeRole(allRanks.rank0.id);
            message.member.removeRole(allRanks.rank1.id);
            message.member.removeRole(allRanks.rank2.id);
            message.member.removeRole(allRanks.rank3.id);
            message.member.removeRole(allRanks.rank4.id);

            message.member.addRole(role);
            message.channel.send('```md\n[Твоето K/D:](' + kd + ')\nЧестито вече си ранк: ' + thisGuild.roles.get(role).name + '```').catch(console.error);
        } else {
            message.channel.send(
                '```md\n[Твоето K/D:](' + kd + ')' +
                '\nТвоето K/D не е достатъчно за ранк по-висок от: ' + thisGuild.roles.get(role).name +
                '\nЗа ' + thisGuild.roles.get(nextRole['id']).name + ' ти трябва K/D между: <' + nextRole['kd'][0] + ' ' + nextRole['kd'][1] + '>```'
            ).catch(console.error);
        }
    }

    function secondsToString(minutes) {
        var numdays = Math.floor(minutes / 1440);
        var numhours = Math.floor((minutes % 1440) / 60);
        var numminutes = Math.floor(((minutes % 1440) % 60) % 60);
        return numdays + "d" + numhours + "h" + numminutes + "m";
    }

    function pad(value, length) {
        value +="";
        return (value.toString().length <= length) ? pad(value + emptySpace, length) : value;
    }

     function getKD(numb){
        var kdResult = (playerStats[numb].kills / (playerStats[numb].games - playerStats[numb].placeA)).toFixed(2);
        playerStats[numb].kd = kdResult;
        return kdResult;
    }

    function allTime(stat, devide) {
        var allThree = (playerStats[0][stat] *1)+ (playerStats[1][stat] *1) + (playerStats[2][stat] *1);
        if (devide) {
            allThree = (allThree / 3).toFixed(2);
        }
        return allThree;
    }

    function fillTemplate(statsInput){
        let lifetimeStats = statsInput.lifetimeStats;
        let info = statsInput.info;
        let stats = statsInput.group;

        let embedObj = {
            author: {
                name: "All time stats: " + targetSearch
                /*,
                icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'*/
            },
            color: intColor,
            // hexColor : '#ffffff',
            url: "https://www.epicgames.com/fortnite/en-US/home",
            title: "Games" + emptySpace + emptySpace + emptySpace + "Wins"  + emptySpace + emptySpace +  emptySpace + "Kills"  + emptySpace + emptySpace +  "K/D"  + emptySpace + emptySpace + emptySpace + "Time Played\n" + emptySpace +
                  emptySpace +  pad(lifetimeStats.matches, 7) + " " + pad(lifetimeStats.wins, 5) + pad(lifetimeStats.kills, 5) + pad(lifetimeStats['k/d'], 6) + pad(lifetimeStats.timePlayed, 9) + emptySpace,
            description: emptySpace + ":black_circle:``\n=============== Solo ====================``:black_circle:",
            thumbnail:{
                width: "500",
                height: "500",
                url: "https://cdn.atr.cloud/monthly_2017_10/FortniteClient-Win64-Shipping_123.ico_256x256.png.9db57869789ecc4d9c5f72c5a9ba9e30.thumb.png.d8d082ccd47b246fc3773e854b1b2ead.png"
            },
            fields: [{
                name: "Wins" + emptySpace + emptySpace + "Games" + emptySpace,
                value: pad(stats.solo.wins, 5) + pad(stats.solo.matches, 5),
                inline: true
            },{
                name: "Kills" + emptySpace + emptySpace + emptySpace + "K/D",
                value: pad(stats.solo.kills, 5) + pad(stats.solo['k/d'], 4),
                inline: true
            },{
                name: "Top 10"  + emptySpace + " Top 25" + emptySpace,
                value: pad(stats.solo.top10, 5) + pad(stats.solo.top25, 5),
                inline: true
            },{
                name: "Win %"  + emptySpace + emptySpace + "Time Played",
                value: pad(stats.solo['win%'] , 6) + pad(stats.solo.timePlayed, 9),
                inline: true
            }],
        }
        var embedObj2 = {
            color: intColor,
            description: ":black_circle:`\n=============== Duo ====================`:black_circle:",
            fields: [{
                name: "Wins" + emptySpace + emptySpace + "Games" + emptySpace,
                value: pad(stats.duo.wins, 5) + " " + pad(stats.duo.matches, 5),
                inline: true
            },{
                name: "Kills" + emptySpace + emptySpace + emptySpace + "K/D",
                value: pad(stats.duo.kills, 5) + pad(stats.duo['k/d'], 4),
                inline: true
            },{
                name: "Top 05"  + emptySpace +  " Top 12" + emptySpace,
                value: pad(stats.duo.top5, 5) + " " + pad(stats.duo.top12, 5),
                inline: true
            },{
                name: "Win %"  + emptySpace + emptySpace + "Time Played",
                value: pad(stats.duo['win%'], 6) + pad(stats.duo.timePlayed, 9),
                inline: true
            }],
            thumbnail:{
                width: "500",
                height: "500",
                url: "https://vignette.wikia.nocookie.net/fortnite/images/6/65/Icon_Ranged.png/revision/latest?cb=20170806023208"
            }
        }
        var embedObj3 = {
            color: intColor,
            description: ":black_circle:`\n=============== Squad ===================:`:black_circle:",
            fields: [{
                name: "Wins" + emptySpace + emptySpace + "Games",
                value: pad(stats.squad.wins, 5)  + pad(stats.squad.matches, 4),
                inline: true
            },{
                name: "Kills" + emptySpace + emptySpace + emptySpace + "K/D",
                value: pad(stats.squad.kills, 5) + pad(stats.squad['k/d'], 6),
                inline: true
            },{
                name: "Top 03"  + emptySpace  +  " Top 6",
                value: pad(stats.squad.top3, 6) + " " + pad(stats.squad.top6, 4),
                inline: true
            },{
                name: "Win %"  + emptySpace + emptySpace + "Time Played",
                value:  pad(stats.squad['win%'] , 6) + pad(stats.squad.timePlayed, 9),
                inline: true
            }],
            thumbnail:{
                width: "500",
                height: "500",
                url: "https://i.imgur.com/IMjozOI.png"
            },
            footer: {
                icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg',
                text: "!helpstats for more information"
            },
            image: { url: "https://d1u5p3l4wpay3k.cloudfront.net/fortnite_gamepedia/8/81/Scar_schema.png" },
            timestamp: new Date()
        };

        // var someObj = new Discord.Attachment("./pics/fornite-name2.png", "fornite-name2")

        message.channel.send({
            embed: embedObj
        }).catch(console.error);

        message.channel.send({
            embed: embedObj2,
        }).catch(console.error);

        message.channel.send({
            embed: embedObj3,
        }).catch(console.error);
    }

    function sendNews(news){
        for (var i = 0; i < news.length; i++) {
            message.channel.send({
                embed: {
                    color: intColor,
                    title: ":black_circle:`\n=== " + news[i].title + " ===`:black_circle:",
                    description: news[i].body ,
                    image:{
                        url: news[i].image
                    }
                }
            }).catch(console.error);
        }
    }
    function dropMe(){
        var locations = ["Anarchy Acres", "Fatal Fields","Flush Factory","Greasy Grove","Lonely Lodge","Loot Lake","Moisty Mire","Pleasant Park","Retail Row","Wailing Woods"];

        if (Math.random() < .5) // half the time give a location between two map locations
        {
            var randLoc1 = locations[Math.floor(Math.random()* locations.length)];
            var randLoc2 = locations[Math.floor(Math.random()* locations.length)];
            while (randLoc1 == randLoc2){
                var randLoc2 = locations[Math.floor(Math.random()* locations.length)];
            }
            return "между ***" + randLoc1 + "*** и ***" + randLoc2 + "***";
        }
        else // otherwise give map location
        {
            var randLoc = locations[Math.floor(Math.random()* locations.length)];
            return "**" + randLoc + "**";
        }


    }
});

client.login(config.token);
