const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const emptySpace ="ᅠ";//empty space
// const fs = require('fs');
const randomColor = require('randomcolor');
const myRoles = {
    checked: '392744795149172738',
    Unranked: '376054967103913984',
    Rank1: '376004191300091904',
    Rank2 : '376004340986413058',
    Rank3 : '376039937843265537',
    RankLegendary: '393039424226590722'
}

// Math.floor(Math.random()*16777215),
var https = require('https');
var Jimp = require("jimp");
var hexColor = randomColor();
var embedColor = randomColor({
   format: 'rgbArray',
   alpha: 0.5
});
var intColorAlpha = Jimp.rgbaToInt(embedColor[0],embedColor[1],embedColor[2], 1);
var intColor = Math.floor(Math.random()*16777215);
var white = Jimp.rgbaToInt(255, 255, 255, 0);
var fortniteImg;

Jimp.read("pics/fornite-name.png", function (err, image) {
    // image.clone();
    image.resize(150, 150, function (err, image) {
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx){
                if(this.getPixelColor(x, y) == white){
                    image.setPixelColor(intColorAlpha, x, y, function(err, image){
                        // image.write( "pics/fornite-name3.png")
                    })
                }

        })
    })
})
// console.log(fortniteImg);
client.on("ready", () => {
    console.log('Connected');
    client.user.setGame('!helpstats');
});

client.on("message", (message) => {
    // const msgTemplate = new Discord.RichEmbed();

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    var args = message.content.substring(1).split(' ');
    var baseCommand = args[0];

    var auhor = message.author; //message.author.id;
    var nick = auhor.lastMessage.member.nickname ? auhor.lastMessage.member.nickname : auhor.username;
    var targetSearch = args[1] != undefined ? args[1] : nick; // who are you checking
    var datetime = new Date().getTime();
    console.log(datetime + " searched by " + auhor.tag + "|nick: " + nick + " |target: " + targetSearch);



    if (message.content.startsWith(config.prefix)) {
        switch(baseCommand) {
            case 'stats':
                if(message.member.roles.has(myRoles.checked)) {
                    console.log('checked');
                    getUserData(true);
                } else {
                    lookupPlayer();
                    message.member.addRole(myRoles.checked).catch(console.error);
                }
            break;
            case 'count':
                let rank0 = message.guild.roles.get(myRoles.Unranked).members;
                let rank1 = message.guild.roles.get(myRoles.Rank1).members;
                let rank2 = message.guild.roles.get(myRoles.Rank2).members;
                let rank3 = message.guild.roles.get(myRoles.Rank3).members;
                let rank4 = message.guild.roles.get(myRoles.RankLegendary).members;
                message.channel.send("```md\n[Total users in server:](" + message.guild.memberCount + ")" +
                    "\n" + rank0.size + ". Users with Rank Unranked " +
                    "\n" + rank1.size + ". Users with Rank 1" +
                    "\n" + rank2.size + ". Users with Rank 2" +
                    "\n" + rank3.size + ". Users with Rank 3" +
                    "\n" + rank4.size + ". Users with Rank Legendary```").catch(console.error);
            break;
            case 'rankme':
                getUserData();
            break;
            case 'helpstats':
                message.channel.send('"!stats" - to check your stats \n"!stats some_name" - to check someone elses stats').catch(console.error);
            break;

        }
    }
    var playerStats = {};

    function lookupPlayer(){
        if (targetSearch) {
            https.get("https://api.partybus.gg/v1/players/lookup/" + encodeURIComponent(targetSearch), function(resp){
                resp.setEncoding('utf8');
                resp.on('data', function(chunk){
                    getUserData(true);
                });
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
        }
    }

    function getUserData(fill){
        if (targetSearch) {
            https.get("https://api.partybus.gg/v1/players/" + encodeURIComponent(targetSearch), function(resp){
                resp.setEncoding('utf8');
                resp.on('data', function(chunk){

                    try {
                        var res = JSON.parse(chunk);
                        playerStats = res.stats;
                        playerStats.details = res.details;
                        if (fill) {
                            fillTemplate();
                        } else {
                            rankPlayer()
                        }
                    }
                    catch(err) {
                        console.log(err);
                        message.channel.send("Error 400!!! (Bad Request)");
                    }

                });
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
        }
    }
    function rankPlayer(){
        let kd = Math.max(getKD(0),getKD(1),getKD(2));
        // let curRole = .find("name", "Team Mystic");

        switch (true) {
            case (kd < 0.5):
                setRole(myRoles.Unranked, myRoles.Unranked, kd);
                break;
            case (kd > 0.5 && kd < 1.5):
                setRole(myRoles.Rank1, myRoles.Rank1, kd);
                break;
            case (kd > 1.5 && kd < 3.0):
                setRole(myRoles.Rank2, myRoles.Rank2, kd);
                break;
            case (kd > 3.0 && kd < 5.0):
                setRole(myRoles.Rank3, myRoles.Rank3, kd);
                break;
            case (kd > 5.0):
                setRole(myRoles.RankLegendary, myRoles.RankLegendary, kd);
                message.channel.send('```css\nБрат ти си легенда!!!1!!111!1!```' + message.guild.roles.get(myRoles.RankLegendary));
                break;
            default:
                setRole(myRoles.Unranked, myRoles.Unranked);
        }
    }
    function setRole(oldRole, newRole, kd) {
        if(!message.member.roles.has(newRole)) {
            message.member.removeRoles([myRoles.Unranked, myRoles.Rank1,myRoles.Rank2,myRoles.Rank3,myRoles.RankLegendary]).catch(console.error);
            message.member.addRole(newRole).catch(console.error);

            message.channel.send('```K/D: ' + kd + '\nЧестито вече си ранк: ' + message.guild.roles.get(newRole).name + '```');
        } else {
            message.channel.send('```K/D: ' + kd + '\nНе е достатъчен за по-висок ранк от: ' + message.guild.roles.get(oldRole).name + '```');
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
        return (value.toString().length < length) ? pad(value + emptySpace, length) : value;
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

    function fillTemplate(){
        if (playerStats == undefined) {
            message.channel.send('Fortnite user nor found. Please set your Discord nickname the same as in the game.');
        } else if(playerStats.length <= 0){
            message.channel.send('Fortnite user added please wait 2min to see stats');
        } else {
            var embedObj = {
                author: {
                    name: "All time stats: " + targetSearch ,
                    icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
                },
                color: intColor,
                // hexColor : '#ffffff',
                url: "https://partybus.gg/player/" + targetSearch,
                title: "Games" + emptySpace + emptySpace + emptySpace + "Wins"  + emptySpace + emptySpace +  emptySpace + "Kills"  + emptySpace + emptySpace +  "K/D"  + emptySpace + emptySpace + emptySpace + "Time Played\n" + emptySpace +
                      emptySpace +  pad(allTime('games'), 7) + " " + pad(allTime('placeA'), 6) + pad(allTime('kills'), 5) + pad(allTime('kd', true), 7) + pad(secondsToString(allTime('minutes')), 9) + emptySpace,
                description: emptySpace + ":black_circle:``\n=============== Solo ====================``:black_circle:",
                thumbnail:{
                    width: "500",
                    height: "500",
                    url: "https://cdn.atr.cloud/monthly_2017_10/FortniteClient-Win64-Shipping_123.ico_256x256.png.9db57869789ecc4d9c5f72c5a9ba9e30.thumb.png.d8d082ccd47b246fc3773e854b1b2ead.png"
                },
                fields: [{
                    name: "Wins" + emptySpace + emptySpace + "Games" + emptySpace,
                    value: pad(playerStats[0].placeA, 5) + pad(playerStats[0].games, 5),
                    inline: true
                },{
                    name: "Kills" + emptySpace + emptySpace + "K/D",
                    value: pad(playerStats[0].kills, 5) + pad(getKD(0), 4),
                    inline: true
                },{
                    name: "Top 10"  + emptySpace + " Top 25" + emptySpace,
                    value: pad(playerStats[0].placeB, 5) + pad(playerStats[0].placeC, 5),
                    inline: true
                },{
                    name: "Win %"  + emptySpace + "Time Played",
                    value: pad(Number((playerStats[0].placeA / (playerStats[0].games / 100)).toFixed(2)) , 6) + pad(secondsToString(playerStats[0].minutes), 9),
                    inline: true
                }],
            }
            var embedObj2 = {
                color: intColor,
                description: ":black_circle:`\n=============== Duo ====================`:black_circle:",
                fields: [{
                    name: "Wins" + emptySpace + emptySpace + "Games" + emptySpace,
                    value: pad(playerStats[2].placeA, 5) + " " + pad(playerStats[2].games, 5),
                    inline: true
                },{
                    name: "Kills" + emptySpace + emptySpace + "K/D",
                    value: pad(playerStats[2].kills, 5) + pad(getKD(2), 4),
                    inline: true
                },{
                    name: "Top 05"  + emptySpace +  " Top 12" + emptySpace,
                    value: pad(playerStats[2].placeB, 5) + " " + pad(playerStats[2].placeC, 5),
                    inline: true
                },{
                    name: "Win %"  + emptySpace + "Time Played",
                    value: pad(Number((playerStats[2].placeA / (playerStats[2].games / 100)).toFixed(2)) , 6) + pad(secondsToString(playerStats[2].minutes), 9),
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
                    value: pad(playerStats[1].placeA, 5)  + pad(playerStats[1].games, 4),
                    inline: true
                },{
                    name: "Kills" + emptySpace + emptySpace + "K/D",
                    value: pad(playerStats[1].kills, 5) + pad(getKD(1), 6),
                    inline: true
                },{
                    name: "Top 03"  + emptySpace  +  " Top 6",
                    value: pad(playerStats[1].placeB, 6) + " " + pad(playerStats[1].placeC, 4),
                    inline: true
                },{
                    name: "Win %"  + emptySpace + "Time Played",
                    value:  pad(Number((playerStats[1].placeA / (playerStats[1].games / 100)).toFixed(2)) , 6) + pad(secondsToString(playerStats[1].minutes), 9),
                    inline: true
                }],
                thumbnail:{
                    width: "500",
                    height: "500",
                    url: "https://i.imgur.com/IMjozOI.png"
                },
                footer: {
                    icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg',
                    text: "!helpstats; !stats; !stats some_name" + emptySpace + " | Last Checked At:"
                },
                timestamp: new Date(playerStats.details.checked)
            };

            // var someObj = new Discord.Attachment("./pics/fornite-name2.png", "fornite-name2")

            message.channel.send({
                embed: embedObj
            }).catch(console.error);

            message.channel.send({
                embed: embedObj2,
            }).catch(console.error);

            Jimp.read("https://d1u5p3l4wpay3k.cloudfront.net/fortnite_gamepedia/8/81/Scar_schema.png", function (err, image) {

                    embedObj3.image = image;
                    embedObj3.image.url = "https://d1u5p3l4wpay3k.cloudfront.net/fortnite_gamepedia/8/81/Scar_schema.png"
                    console.log(image);

                message.channel.send({
                    embed: embedObj3,
                    // attachment: someObj
                }).catch(console.error);

                image.resize(100, 75, function (err, image) {
                    embedObj3.image = image
                    console.log(embedObj3.image);

                })
            })


        }
    }
});
/*var options = {
    host: 'https://api.partybus.gg/v1/players/',
    family: 4,
    port: 443
};*/
client.login(config.token);
