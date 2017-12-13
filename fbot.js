const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const emptySpace ="ᅠ";//empty space
// const fs = require('fs');
const randomColor = require('randomcolor');

var https = require('https');
var Jimp = require("jimp");

var embedColor = randomColor({
   format: 'rgbArray',
   alpha: 0.5
});
var embedColorInt = Jimp.rgbaToInt(embedColor[0],embedColor[1],embedColor[2], 1);
var white = Jimp.rgbaToInt(255, 255, 255, 0);
var fortniteImg;

Jimp.read("pics/fornite-name.png", function (err, image) {
    // image.clone();
    image.resize(150, 150, function (err, image) {
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx){
                if(this.getPixelColor(x, y) == white){
                    image.setPixelColor(embedColorInt, x, y, function(err, image){
                        // image.write( "pics/fornite-name3.png")
                    })
                }

        })
        // console.log(image.getMIME());

        // image.getBuffer( image.getMIME(), function(err, img){
        //     fortniteImg = img;
        // });
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
    //GuildMember.nickname

    var args = message.content.substring(1).split(' ');
    var baseCommand = args[0];

    var auhor = message.author;
    console.log("searched by " + auhor.tag);
    // var authorId = message.author.id;
    var nick = message.author.lastMessage.member.nickname ? message.author.lastMessage.member.nickname : message.author.username;

    var targetSearch = args[1] != undefined ? args[1] : nick; // who are you checking
    // var iterator = 3; //here if we're gonna check only one game mode

    if (message.content.startsWith(config.prefix)) {
        switch(baseCommand) {
            case 'stats':
                lookupPlayer();
            break;
            case 'count':
                message.channel.send("Users in server: " + message.guild.memberCount).catch(console.error);
            break;
            case 'helpstats':
                message.channel.send('"!stats" - to check your stats \n"!stats some_name" - to check someone elses stats').catch(console.error);
            break;
        }
    }
    var playerStats;

    function lookupPlayer(){
        if (targetSearch) {
            https.get("https://api.partybus.gg/v1/players/lookup/" + encodeURIComponent(targetSearch), function(resp){
                resp.setEncoding('utf8');
                resp.on('data', function(chunk){
                    getUserData();
                });
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
        }
    }

    function getUserData(){
        if (targetSearch) {
            https.get("https://api.partybus.gg/v1/players/" + encodeURIComponent(targetSearch), function(resp){
                resp.setEncoding('utf8');
                resp.on('data', function(chunk){

                    try {
                        var res = JSON.parse(chunk);
                        playerStats = res.stats;
                        playerStats.details = res.details;
                    }
                    catch(err) {
                        message.channel.send("Error 400!!! (Bad Request)");
                    }
                    fillTemplate();

                });
            }).on("error", function(e){
                console.log("Got error: " + e.message);
            });
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
                color: Math.floor(Math.random()*16777215),
                // hexColor : '#ffffff',
                fields: [{
                    name: emptySpace,
                    value: "================= **__Solo__** ==================="
                },{
                    name: "Wins" + emptySpace + emptySpace + "Games",
                    value: pad(playerStats[0].placeA, 5) + pad(playerStats[0].games, 4),
                    inline: true
                },{
                    name: "Kills" + emptySpace + emptySpace + "K/D",
                    value: pad(playerStats[0].kills, 5) + pad(getKD(0), 4),
                    inline: true
                },{
                    name: "Top 10"  + emptySpace + " Top 25",
                    value: pad(playerStats[0].placeB, 5) + pad(playerStats[0].placeC, 4),
                    inline: true
                },{
                    name: "Win %"  + emptySpace + "Time Played",
                    value: pad(Number((playerStats[0].placeA / (playerStats[0].games / 100)).toFixed(2)) , 6) + pad(secondsToString(playerStats[0].minutes), 9),
                    inline: true
                },{
                    name: emptySpace,
                    value: "================= **__Duo__** ==================="
                },{
                    name: "Wins" + emptySpace + emptySpace + "Games",
                    value: pad(playerStats[2].placeA, 5) + " " + pad(playerStats[2].games, 4),
                    inline: true
                },{
                    name: "Kills" + emptySpace + emptySpace + "K/D",
                    value: pad(playerStats[2].kills, 5) + pad(getKD(2), 4),
                    inline: true
                },{
                    name: "Top 05"  + emptySpace +  " Top 12",
                    value: pad(playerStats[2].placeB, 5) + " " + pad(playerStats[2].placeC, 4),
                    inline: true
                },{
                    name: "Win %"  + emptySpace + "Time Played",
                    value: pad(Number((playerStats[2].placeA / (playerStats[2].games / 100)).toFixed(2)) , 6) + pad(secondsToString(playerStats[2].minutes), 9),
                    inline: true
                },{
                    name: emptySpace,
                    value: "================ **__Squad__** =================="
                },{
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
                title: "Discord Fortnite Battle Royale stats tracking bot.",
                url: "https://partybus.gg/player/" + targetSearch,
                description: "```\nAll time stats:\n" +
                    "Games" + emptySpace + "Wins"  + emptySpace +  "Kills"  + emptySpace +  "K/D"  + emptySpace +  "Time Played\n" +
                    pad(allTime('games'), 5) + " " + pad(allTime('placeA'), 4) + pad(allTime('kills'), 4) + pad(allTime('kd', true), 5) + pad(secondsToString(allTime('minutes')), 9) + "```",

                timestamp: new Date(playerStats.details.checked),
                thumbnail:{
                    width: "500",
                    height: "500",
                    url: "https://cdn.atr.cloud/monthly_2017_10/FortniteClient-Win64-Shipping_123.ico_256x256.png.9db57869789ecc4d9c5f72c5a9ba9e30.thumb.png.d8d082ccd47b246fc3773e854b1b2ead.png"
                },
                image:{
                    width: "300",
                    height: "300",
                    // url: "https://psmedia.playstation.com/is/image/psmedia/fornite-badge-01-ps4-eu-02jun17?$HugeHero_Badge$"
                    url: someObj
                },
                author: {
                    name: "Fortnite stats of " + targetSearch,
                    icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
                },
                footer: {
                    icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg',
                    text: "!helpstats; !stats; !stats some_name" + emptySpace + " | Last Checked At:"
                }
            };
            var someObj = new Discord.Attachment("./pics/fornite-name2.png", "fornite-name2")

            console.log(someObj.Attachment);
            // console.log(someObj.Attachment.file);
            // console.log(someObj.Attachment.file.attachment);

            message.channel.send({
                embed: embedObj,
                attachment: someObj
            }).catch(console.error);
        }
    }
});
/*var options = {
    host: 'https://api.partybus.gg/v1/players/',
    family: 4,
    port: 443
};*/
client.login(config.token);
