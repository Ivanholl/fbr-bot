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
            image: { url: "https://d1u5p3l4wpay3k.cloudfront.net/fortnite_gamepedia/8/81/Scar_schema.png" },
            timestamp: new Date(playerStats.details.checked)
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
