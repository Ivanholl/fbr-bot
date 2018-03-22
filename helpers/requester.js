const Fortnite = require('../node_modules/fortnite-api');
const auth = require('../auth.json');
let fortniteAPI = new Fortnite([auth.api.acc, auth.api.pass, auth.api.token1, auth.api.token2]);

class Requester {
    constructor() {
        fortniteAPI.login()
            .then((stats) => {
                console.log("Logged in Fortnite!");
            })
            .catch((err) => {
                console.log(err);
                console.log("Not logged in Fortnite!");
            });
    }
    getStatsBRFromID(targetSearch) {
        return new Promise((resolve, reject) => {
            fortniteAPI.getStatsBRFromID('cd842a7777d641b592adaeaa22805f6b', 'pc')
                .then(stats => { console.log(stats)})
                .catch(err => { console.log(stats)})
        })
    }
    pvpStats(targetSearch){
        // targetSearch = encodeURIComponent(targetSearch);
        return new Promise((resolve, reject) => {
            fortniteAPI.getStatsBR(targetSearch, 'pc')
                .then(stats => { resolve(stats)})
                .catch(err => { reject(err)})
        })
    }

    pvеStats(){
        targetSearch = encodeURI(targetSearch);
        let squads = {
            emt: [],
            training: [],
            fireAlpha:[],
            closeAssoult:[],
            gadgeteers:[],
            scountingParty:[],
            engineering:[],
            thinkTank:[]
        }
        let noqsuad =[];
        fortniteAPI.getStatsPVE(targetSearch)
            .then((stats) => {
                // console.log(typeof stats.profile.items);
                for (key in stats.profile.items) {
                    // console.log(key);
                    if (stats.profile.items[key].templateId.startsWith('Worker:')) {
                        // if(stats.profile.items[key].attributes.squad_slot_idx == 1) {
                        //     let isLead = false
                        // }
                        switch (stats.profile.items[key].attributes.squad_id) {
                            case 'squad_attribute_medicine_emtsquad':
                                squads.emt.push(stats.profile.items[key])
                                break;
                            case 'squad_attribute_medicine_trainingteam':
                                squads.training.push(stats.profile.items[key])
                                break;
                            case 'squad_attribute_arms_fireteamalpha':
                                squads.fireAlpha.push(stats.profile.items[key])
                                break;
                            case 'squad_attribute_arms_closeassaultsquad':
                                squads.closeAssoult.push(stats.profile.items[key])
                                break;
                            case 'squad_attribute_medicine_emtsquad':
                                squads.gadgeteers.push(stats.profile.items[key])
                                break;
                            case 'squad_attribute_scavenging_scoutingparty':
                                squads.scountingParty.push(stats.profile.items[key])
                                break;
                            case 'squad_attribute_synthesis_corpsofengineering':
                                squads.engineering.push(stats.profile.items[key])
                                break;
                            case 'squad_attribute_synthesis_thethinktank':
                                squads.thinkTank.push(stats.profile.items[key])
                                break;
                            default:
                                noqsuad.push(stats.profile.items[key])
                                break;
                        }
                        // console.log(stats.profile.items[key]);
                    }
                }
                // console.log(squads);
                // console.log(stats.profile.stats.attributes.gameplay_stats);
                message.channel.send(`RVN: ${stats.profile.rvn} \n WipeNumber: ${stats.profile.wipeNumber} \n CommandRevision: ${stats.profile.commandRevision}`).catch(console.error)
                return
            })
            .catch((err) => {
                console.log(err);
            });
    }
    serverStatus(){
        return new Promise((resolve, reject) => {
            fortniteAPI.checkFortniteStatus()
                .then(status => { resolve(status)})
                .catch(err => { reject(err)})
        })
    }
}

module.exports = Requester;
