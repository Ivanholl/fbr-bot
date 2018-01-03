const Discord = require("discord.js");
const Fortnite = require('./node_modules/fortnite-api');

const config = require('./config.json');
// const randomColor = require('randomcolor');
const ImageBuilder = require('./imageBuilder.js');
const allRanks = config.allRanks;
// const request = require("request-promise");

const client = new Discord.Client();
let fortniteAPI = new Fortnite([config.api.acc, config.api.pass, config.api.token1, config.api.token2]);

var emptySpace = "ᅠ"; //empty space
var thisGuild,
    auhor, //message.author.id;
    targetSearch,
    nick,
    intColor,
    baseCommand,
    message;

client.on("ready", () => {
    console.log('Connected to Discord');
    client.user.setGame('!help');
    // client.user.setAvatar('http://icons.veryicon.com/ico/Movie%20%26%20TV/Futurama%20Vol.%204%20-%20The%20Robots/Calculon.ico')

    fortniteAPI.login()
        .then((stats) => {
            console.log("logged in Fortnite");
        })
        .catch((err) => {
            console.log("not logged in Fortnite");
        });
});

client.on("message", (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    init(message);
    // message.channel.send('спряна').catch(console.error);
    switch (baseCommand) {
        case 'help':
            message.channel.send('!stats - връща вашите статовe\n!stats some_name - връща статовете на някой\n!count - показва колко хора има в сървъра и по колко са от ранк\n!rankme - проверява вашето K/D и ви слага ранк\n!news - дава новините за Fortnite\n!status - показва дали са Online server-ите за Fortnite\n!drop - избира ви случайно място да паднете').catch(console.error);
            break;
        case 'stats':
            getStats(false);
            break;
        case 'count':
            countMembers();
            break;
        case 'rankme':
            if (targetSearch != nick) {
                message.channel.send('Само себе си може да цъкаш. Ако някой не е с правилен ранк кажи на Хората с Правата').catch(console.error);
                targetSearch = nick
            };
            getStats(true);
            break;
        case 'rankall':
            if (message.member.roles.has(allRanks.admins)) {
                message.channel.send('еее админче').catch(console.error);
                targetSearch = nick
            };
            getStats(true);
            break;
        case 'news':
            sendNews(targetSearch); // targetSearch is Language here
            break;
        case 'status':
            getServerStatus();
            break;
        case 'drop':
            var imageBuilder = new ImageBuilder('html', {width: 2130, height: 850});
            imageBuilder.buildMap().then((image) => {
                    var map = new Discord.Attachment(image, 'map.png');
                    message.channel.send(map).catch(console.error);
            });
            break;
            // default: //no because other bots are confusing this one
            // message.channel.send('"!stats" - to check your stats \n"!stats some_name" - to check someone elses stats').catch(console.error);
    }
    message.channel.stopTyping();
});

client.login(config.token);


function init(input) {
    message = input;
    thisGuild = message.guild
    auhor = message.author
    var args = message.content.substring(1).split(' ');
    baseCommand = args[0];
    var searchedName;
    if (args[1]) {
        args.shift()
        searchedName = args.join(' ');
    }
    nick = auhor.lastMessage.member.nickname ? auhor.lastMessage.member.nickname : auhor.username;
    targetSearch = searchedName != undefined ? searchedName : nick; // who are you checking
    intColor = Math.floor(Math.random() * 16777215);
    console.log("Searched by " + auhor.tag + "|nick: " + nick + " |target: " + targetSearch);

    message.channel.startTyping();
}

function countMembers() {
    message.channel.send(
        "```md\n[Total users in server:](" + thisGuild.memberCount + ")" +
        "\n" + pad(allRanks.rank0.name + ": ", 11) + pad((thisGuild.memberCount * thisGuild.roles.get(allRanks.rank0.id).members.size / 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank0.id).members.size + " users." +
        "\n" + pad(allRanks.rank1.name + ": ", 11) + pad((thisGuild.memberCount * thisGuild.roles.get(allRanks.rank1.id).members.size / 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank1.id).members.size + " users." +
        "\n" + pad(allRanks.rank2.name + ": ", 11) + pad((thisGuild.memberCount * thisGuild.roles.get(allRanks.rank2.id).members.size / 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank2.id).members.size + " users." +
        "\n" + pad(allRanks.rank3.name + ": ", 11) + pad((thisGuild.memberCount * thisGuild.roles.get(allRanks.rank3.id).members.size / 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank3.id).members.size + " users." +
        "\n" + pad(allRanks.rank4.name + ": ", 11) + pad((thisGuild.memberCount * thisGuild.roles.get(allRanks.rank4.id).members.size / 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank4.id).members.size + " users." +
        "\n```"
    ).catch(console.error);
}

function getStats(forRank) {
    fortniteAPI.getStatsBR(targetSearch, 'pc')
        .then((stats) => {
            if (forRank) {
                rankPlayer(stats);
            } else {
                fillTemplate(stats);
            }
        })
        .catch((err) => {
            console.log(err);
            message.channel.send(err).catch(console.error);
        });
}

function getServerStatus() {
    fortniteAPI.checkFortniteStatus()
        .then((serverStatus) => {
            if (serverStatus) {
                message.channel.send('```Fortnite Servers are Online```').catch(console.error)
            } else {
                message.channel.send('```Fortnite Servers are Offline```').catch(console.error)
            }
        })
        .catch((err) => {
            console.log(err);
            message.channel.send(err).catch(console.error)
        });
}

function rankPlayer(stats) {
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
    if (!message.member.roles.has(role)) {
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

function pad(value, length) {
    value += "";
    return (value.toString().length <= length) ? pad(value + emptySpace, length) : value;
}

function fillTemplate(statsInput) {
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
        url: "https://www.epicgames.com/fortnite/en-US/home",
        title: "Games" + emptySpace + emptySpace + emptySpace + "Wins" + emptySpace + emptySpace + emptySpace + "Kills" + emptySpace + emptySpace + "K/D" + emptySpace + emptySpace + emptySpace + "Time Played\n" + emptySpace +
            emptySpace + pad(lifetimeStats.matches, 7) + " " + pad(lifetimeStats.wins, 5) + pad(lifetimeStats.kills, 5) + pad(lifetimeStats['k/d'], 6) + pad(lifetimeStats.timePlayed, 9) + emptySpace,
        description: emptySpace + ":black_circle:``\n=============== Solo ====================``:black_circle:",
        thumbnail: {
            width: "500",
            height: "500",
            url: "https://cdn.atr.cloud/monthly_2017_10/FortniteClient-Win64-Shipping_123.ico_256x256.png.9db57869789ecc4d9c5f72c5a9ba9e30.thumb.png.d8d082ccd47b246fc3773e854b1b2ead.png"
        },
        fields: [{
            name: "Wins" + emptySpace + emptySpace + "Games" + emptySpace,
            value: pad(stats.solo.wins, 5) + pad(stats.solo.matches, 5),
            inline: true
        }, {
            name: "Kills" + emptySpace + emptySpace + emptySpace + "K/D",
            value: pad(stats.solo.kills, 5) + pad(stats.solo['k/d'], 4),
            inline: true
        }, {
            name: "Top 10" + emptySpace + " Top 25" + emptySpace,
            value: pad(stats.solo.top10, 5) + pad(stats.solo.top25, 5),
            inline: true
        }, {
            name: "Win %" + emptySpace + emptySpace + "Time Played",
            value: pad(stats.solo['win%'], 6) + pad(stats.solo.timePlayed, 9),
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
        }, {
            name: "Kills" + emptySpace + emptySpace + emptySpace + "K/D",
            value: pad(stats.duo.kills, 5) + pad(stats.duo['k/d'], 4),
            inline: true
        }, {
            name: "Top 05" + emptySpace + " Top 12" + emptySpace,
            value: pad(stats.duo.top5, 5) + " " + pad(stats.duo.top12, 5),
            inline: true
        }, {
            name: "Win %" + emptySpace + emptySpace + "Time Played",
            value: pad(stats.duo['win%'], 6) + pad(stats.duo.timePlayed, 9),
            inline: true
        }],
        thumbnail: {
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
            value: pad(stats.squad.wins, 5) + pad(stats.squad.matches, 4),
            inline: true
        }, {
            name: "Kills" + emptySpace + emptySpace + emptySpace + "K/D",
            value: pad(stats.squad.kills, 5) + pad(stats.squad['k/d'], 6),
            inline: true
        }, {
            name: "Top 03" + emptySpace + " Top 6",
            value: pad(stats.squad.top3, 6) + " " + pad(stats.squad.top6, 4),
            inline: true
        }, {
            name: "Win %" + emptySpace + emptySpace + "Time Played",
            value: pad(stats.squad['win%'], 6) + pad(stats.squad.timePlayed, 9),
            inline: true
        }],
        thumbnail: {
            width: "500",
            height: "500",
            url: "https://i.imgur.com/IMjozOI.png"
        },
        footer: {
            icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg',
            text: "!helpstats for more information"
        },
        image: {
            url: "https://d1u5p3l4wpay3k.cloudfront.net/fortnite_gamepedia/8/81/Scar_schema.png"
        },
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

function sendNews(lang) {
    fortniteAPI.getFortniteNews(lang)
        .then((data) => {
            console.log(data);
            imageBuilder.buildNews(data).then(function(img) {
                message.channel.send({
                    file: img
                }).catch(console.error);
            })
            // let news = data.br;
            // for (var i = 0; i < news.length; i++) {
            //     message.channel.send({
            //         embed: {
            //             color: intColor,
            //             title: ":black_circle:`\n=== " + news[i].title + " ===`:black_circle:",
            //             description: news[i].body ,
            //             image:{
            //                 url: news[i].image
            //             }
            //         }
            //     }).catch(console.error);
            // }
        })
        .catch((err) => {
            console.log(err);
            message.channel.send(err).catch(console.error);
        });
}

function dropMe() {
    var locations = ["Anarchy Acres", "Fatal Fields", "Flush Factory", "Greasy Grove", "Lonely Lodge", "Loot Lake", "Moisty Mire", "Pleasant Park", "Retail Row", "Wailing Woods"];

    if (Math.random() < .005) { // half the time give a location between two map locations
        var randLoc1 = locations[Math.floor(Math.random() * locations.length)];
        var randLoc2 = locations[Math.floor(Math.random() * locations.length)];
        while (randLoc1 == randLoc2) {
            var randLoc2 = locations[Math.floor(Math.random() * locations.length)];
        }

        return "```Скочи между **" + randLoc1 + "** и **" + randLoc2 + "**```";
    } else { // otherwise give map location
        var randLoc = locations[Math.floor(Math.random() * locations.length)];

        return "Скочи в **" + randLoc + "**";
    }
}
