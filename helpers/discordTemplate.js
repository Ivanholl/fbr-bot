const Helpers = require('./helpers.js')

let helpers = new Helpers();
let emptySpace = helpers.emptySpace;
let pad = function(value, length) {
    return helpers.padToLength(value, length);
}

class DiscordTemplates {
    constructor(){
        this.color =  Math.floor(Math.random() * 16777215);
    }

    fillStatsTemplate(statsInput, targetSearch) {
        let lifetimeStats = statsInput.lifetimeStats;
        let info = statsInput.info;
        let stats = statsInput.group;

        let embedObj1 = {
            author: {
                name: pad("All time stats: ", 18) + decodeURI(targetSearch),
                icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
            },
            color: this.color,
            url: "https://www.epicgames.com/fortnite/en-US/home",
            // title: "Games" + emptySpace + emptySpace + emptySpace + "Wins" + emptySpace + emptySpace + emptySpace + "Kills" + emptySpace + emptySpace + "K/D" + emptySpace + emptySpace + emptySpace + "Time Played\n" + emptySpace + emptySpace + pad(lifetimeStats.matches, 7) + " " + pad(lifetimeStats.wins, 5) + pad(lifetimeStats.kills, 5) + pad(lifetimeStats['k/d'], 6) + pad(lifetimeStats.timePlayed, 9) + emptySpace,
            title: pad("Games", 8) + pad("Wins", 7) + pad("Kills", 7) + pad("K/D", 6) + "Time Played\n"
                    + emptySpace + emptySpace + pad(lifetimeStats.matches, 8) + " " + pad(lifetimeStats.wins, 7) + pad(lifetimeStats.kills, 6) + pad(lifetimeStats['k/d'], 8) + pad(lifetimeStats.timePlayed, 9),
            thumbnail: {
                width: "500",
                height: "500",
                url: "https://cdn.atr.cloud/monthly_2017_10/FortniteClient-Win64-Shipping_123.ico_256x256.png.9db57869789ecc4d9c5f72c5a9ba9e30.thumb.png.d8d082ccd47b246fc3773e854b1b2ead.png"
            }
        }
        let embedObj2 = {
            color: this.color,
            description: emptySpace + ":black_circle:``\n==================== Solo =========================``:black_circle:",
            fields: this.getFields(stats.solo.wins, stats.solo.matches, stats.solo.kills, stats.solo['k/d'], stats.solo.top10, stats.solo.top25, stats.solo['win%'], stats.solo.timePlayed),
        }
        let embedObj3 = {
            color: this.color,
            description: emptySpace +  ":black_circle:`\n==================== Duo =========================`:black_circle:",
            fields: this.getFields(stats.duo.wins, stats.duo.matches, stats.duo.kills, stats.duo['k/d'], stats.duo.top5, stats.duo.top12, stats.duo['win%'], stats.duo.timePlayed),
            // thumbnail: {
            //     width: "500",
            //     height: "500",
            //     url: "https://vignette.wikia.nocookie.net/fortnite/images/6/65/Icon_Ranged.png/revision/latest?cb=20170806023208"
            // }
        }
        let embedObj4 = {
            color: this.color,
            description: emptySpace + ":black_circle:`\n==================== Squad ========================:`:black_circle:",
            fields: this.getFields(stats.squad.wins, stats.squad.matches, stats.squad.kills, stats.squad['k/d'], stats.squad.top3, stats.squad.top6, stats.squad['win%'], stats.squad.timePlayed),
            // thumbnail: {
            //     width: "500",
            //     height: "500",
            //     url: "https://i.imgur.com/IMjozOI.png"
            // },
            footer: {
                icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg',
                text: 'Say: "!help" for more commands information!'
            },
            image: {
                url: "https://d1u5p3l4wpay3k.cloudfront.net/fortnite_gamepedia/8/81/Scar_schema.png"
            },
            timestamp: new Date()
        };

        return {
            embedObj1,
            embedObj2,
            embedObj3,
            embedObj4
        }
    }
    getFields(wins, matches, kills, kd, top10, top25, winp, time){
        // return [{
        //     name: "Wins" + emptySpace + emptySpace + "Games" + emptySpace,
        //     value: pad(wins, 5) + pad(matches, 5),
        //     inline: true
        // }, {
        //     name: "Kills" + emptySpace + emptySpace + emptySpace + "K/D",
        //     value: pad(kills, 6) + pad(kd, 4),
        //     inline: true
        // }, {
        //     name: "Top 10" + emptySpace + " Top 25" + emptySpace,
        //     value: pad(top10, 6) + pad(top25, 5),
        //     inline: true
        // }, {
        //     name: "Win %" + emptySpace + emptySpace + "Time Played",
        //     value: pad(winp, 7) + pad(time, 9),
        //     inline: true
        // }]
        return [{
            name: "Wins",
            value: wins,
            inline: true
        },{
            name: "Games",
            value: matches,
            inline: true
        },{
            name: "Kills",
            value: kills,
            inline: true
        },{
            name: "K/D",
            value: kd,
            inline: true
        },{
            name: "Win %",
            value: winp,
            inline: true
        },{
            name: "Time Played",
            value: time,
            inline: true
        }]
    }
    playerOfRole(allRanks, thisGuild){
        var allWithRank = thisGuild.roles.get(allRanks.rank0.id).members.size + thisGuild.roles.get(allRanks.rank1.id).members.size + thisGuild.roles.get(allRanks.rank2.id).members.size + thisGuild.roles.get(allRanks.rank3.id).members.size + thisGuild.roles.get(allRanks.rank4.id).members.size;

        return "```md\n[Total users in server:](" + thisGuild.memberCount + ")" +
        "\n" + pad("Not found:", 15) + pad(helpers.roundNumb((thisGuild.memberCount - allWithRank) / thisGuild.memberCount * 100) + "% - ", 6) + (thisGuild.memberCount - allWithRank) + " users." +
        "\n" + pad(allRanks.rank0.name + ": ", 17) + pad(helpers.roundNumb(thisGuild.roles.get(allRanks.rank0.id).members.size / thisGuild.memberCount * 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank0.id).members.size + " users." +
        "\n" + pad(allRanks.rank1.name + ": ", 18) + pad(helpers.roundNumb(thisGuild.roles.get(allRanks.rank1.id).members.size / thisGuild.memberCount * 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank1.id).members.size + " users." +
        "\n" + pad(allRanks.rank2.name + ": ", 16) + pad(helpers.roundNumb(thisGuild.roles.get(allRanks.rank2.id).members.size / thisGuild.memberCount * 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank2.id).members.size + " users." +
        "\n" + pad(allRanks.rank3.name + ": ", 16) + pad(helpers.roundNumb(thisGuild.roles.get(allRanks.rank3.id).members.size / thisGuild.memberCount * 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank3.id).members.size + " users." +
        "\n" + pad(allRanks.rank4.name + ": ", 1) + pad(helpers.roundNumb(thisGuild.roles.get(allRanks.rank4.id).members.size / thisGuild.memberCount * 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank4.id).members.size + " users." +
        "\n" + pad(allRanks.rank5.name + ": ", 17) + pad(helpers.roundNumb(thisGuild.roles.get(allRanks.rank5.id).members.size / thisGuild.memberCount * 100) + "% - ", 6) + thisGuild.roles.get(allRanks.rank5.id).members.size + " users." +
        "\n```"
    }
}

module.exports = DiscordTemplates;
