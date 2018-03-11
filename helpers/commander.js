const config = require('../config.json');
let allRanks = config.allRanks;
let allChallenges = config.challenges;

const Requester = require('./requester.js');
const Helpers = require('./helpers.js');
const DiscordTemplate = require('./discordTemplate.js');
const RolesManager = require('./rolesManager.js');

let requester = new Requester();
let discordTemplates = new DiscordTemplate();
let rolesManager = new RolesManager();
let helpers = new Helpers();

class Commander {
    constructor(message) {
        this.message = message;
        this.channel = message.channel;
        this.member = message.member;
        this.Guild = message.guild;
        this.auhor = message.author;

        var args = message.content.substring(1).split(' ');

        this.baseCommand = args[0];
        this.nick;
        this.searchedName;

        if (args[1]) {
            args.shift()
            this.searchedName = args.join(' ');
        }
        if (this.auhor.lastMessage.member && this.auhor.lastMessage.member.nickname) {
            this.nick = this.auhor.lastMessage.member.nickname;
        } else {
            this.nick = this.auhor.username;
        }
        this.targetSearch = this.searchedName != undefined ? this.searchedName : this.nick; // who are you checking
        this.targetSearch = this.targetSearch.replace('⚡', '').trim()

        console.log("Searched by " + this.auhor.tag + "|nick: " + this.nick + " |target: " + this.targetSearch);
    }

    pvpStats(){
        requester.pvpStats(this.targetSearch).then(stats => {
            // var stats = require('../old/statsMockUp.js');
            var embedObj = discordTemplates.fillStatsTemplate(stats, this.targetSearch);
            this.sendMessage({ embed: embedObj.embedObj1 })
            this.sendMessage({ embed: embedObj.embedObj2 })
            this.sendMessage({ embed: embedObj.embedObj3 })
            this.sendMessage({ embed: embedObj.embedObj4 })
        }).catch(err => {
            console.log(err);
            this.sendMessage(err)
        })
    }

    getServerStatus() {
        requester.serverStatus().then(serverStatus =>{
            let status = ""
            serverStatus ? status = "Online" : status = "Offline";
            this.sendMessage('```Fortnite Servers are ' + status + '```')
        }).catch(err => {
            console.log(err);
            this.sendMessage(err)
        })
    }

    countPlayers(){
        this.sendMessage(discordTemplates.playerOfRole(allRanks, this.Guild))
    }

    getDrop() {
        var locations = ["Anarchy Acres", "Fatal Fields", "Flush Factory", "Greasy Grove", "Lonely Lodge", "Loot Lake", "Moisty Mire", "Pleasant Park", "Retail Row", "Wailing Woods"];

        if (Math.random() < .005) { // half the time give a location between two map locations
            var randLoc1 = locations[Math.floor(Math.random() * locations.length)];
            var randLoc2 = locations[Math.floor(Math.random() * locations.length)];
            while (randLoc1 == randLoc2) {
                var randLoc2 = locations[Math.floor(Math.random() * locations.length)];
            }
            this.sendMessage(`Скочи между **${randLoc1}** и **${randLoc2}**`)
        } else { // otherwise give map location
            var randLoc = locations[Math.floor(Math.random() * locations.length)];
            this.sendMessage(`Скочи в **${randLoc}**`)
        }
    }

    rankPlayer() {
        if (this.targetSearch != this.nick) {
            this.sendMessage('```Само себе си може да цъкаш. Ако някой не е с правилен ранк кажи на Admins```')
            this.targetSearch = this.nick
        } else {
            requester.pvpStats(this.targetSearch)
            .then(stats =>{
                let kd = Math.max(stats.group.solo['k/d'], stats.group.duo['k/d'], stats.group.squad['k/d']);
                this.setRole(rolesManager.getRole(kd));
            })
            .catch(err => {
                console.log(err);
                this.sendMessage(err)
            })
        }
    }

    setRole(args) {
        if (!this.member.roles.has(args.role)) {
            this.member.removeRole(allRanks.rank0.id);
            this.member.removeRole(allRanks.rank1.id);
            this.member.removeRole(allRanks.rank2.id);
            this.member.removeRole(allRanks.rank3.id);
            this.member.removeRole(allRanks.rank4.id);
            this.member.removeRole(allRanks.rank5.id);

            this.member.addRole(args.role);
            this.sendMessage('```md\n[Твоето K/D:](' + args.kd + ')\nЧестито вече си ранк: ' + this.Guild.roles.get(args.role).name + '```')

        } else {

            this.sendMessage('```md\n[Твоето K/D:](' + args.kd + ')' +
                '\nТвоето K/D не е достатъчно за ранк по-висок от: ' + this.Guild.roles.get(args.role).name +
                '\nЗа ' + this.Guild.roles.get(args.nextRole['id']).name + ' ти трябва K/D между: <' + args.nextRole['kd'][0] + ' ' + args.nextRole['kd'][1] + '>```'
            )
        }
    }

    rollDice(){
        let max = 100;
        if (parseInt(this.targetSearch)) {
            max = parseInt(this.targetSearch);
        }
        var number = Math.floor(Math.random() * max) + 1;
        this.sendMessage(this.member + " " + number)
    }

    setPlatform(){
        if (this.targetSearch == 'pc' && !this.member.roles.has(allRanks.pc.id)) {
            this.member.addRole(allRanks.pc.id);
            this.sendMessage(this.member + " честито вече си с роля ``" + this.Guild.roles.get(allRanks.pc.id).name + "``")

        } else if (this.targetSearch == 'ps4' && !this.member.roles.has(allRanks.ps4.id)) {
            this.member.addRole(allRanks.ps4.id);
            this.sendMessage(this.member + " честито вече си с роля ``" + this.Guild.roles.get(allRanks.ps4.id).name + "``")

        } else if (this.targetSearch == 'xbox'  && !this.member.roles.has(allRanks.xbox.id)) {
            this.member.addRole(allRanks.xbox.id);
            this.sendMessage(this.member + " честито вече си с роля ``" + this.Guild.roles.get(allRanks.xbox.id).name + "``")

        } else if (this.member.roles.has(allRanks.pc.id) || this.member.roles.has(allRanks.ps4.id) || this.member.roles.has(allRanks.xbox.id)) {
            this.sendMessage('Няма роли за добавяне вече имаш тази роля')
        } else {
            this.sendMessage(':x: Грешка! :x: ')
        }
    }
    challenge(){
        if (this.member.voiceChannel && this.member.voiceChannel.members.array().length > 1) {
            var groupChallenge = Math.floor(Math.random() * allChallenges.group.length);
            this.sendMessage('```Групово предизвикателство: ' + allChallenges.group[groupChallenge] + '```')

            this.member.voiceChannel.members.forEach((member) => {
                var soloChallenge = Math.floor(Math.random() * allChallenges.solo.length);
                this.sendMessage('``Соло предизвикателство за: ``' + member + '`` е ' + allChallenges.solo[soloChallenge] + '``')
            })
        } else {
            var soloChallenge = Math.floor(Math.random() * allChallenges.solo.length);
            this.sendMessage('``Соло предизвикателство за: ``' + this.member + '`` е ' + allChallenges.solo[soloChallenge] + '``')
        }
    }
    help() {
        this.sendMessage(helpers.help())
    }
    sendMessage(message){
        this.channel.send(message).catch(console.error);
    }
}
module.exports = Commander;
