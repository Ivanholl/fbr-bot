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
                name: "All time stats: " + decodeURI(targetSearch)
                /*,
                icon_url: 'https://yt3.ggpht.com/-vOrat1emDu8/AAAAAAAAAAI/AAAAAAAAAAA/kVqAWFc_8Vo/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'*/
            },
            color: this.color,
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
        let embedObj2 = {
            color: this.color,
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
        let embedObj3 = {
            color: this.color,
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

        return {
            embedObj1:embedObj1,
            embedObj2:embedObj2,
            embedObj3:embedObj3
        }
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
