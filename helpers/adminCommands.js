function setRole(role, nextRole, kd) {
    if (!targetMember.roles.has(role)) {
        targetMember.removeRole(allRanks.rank0.id);
        targetMember.removeRole(allRanks.rank1.id);
        targetMember.removeRole(allRanks.rank2.id);
        targetMember.removeRole(allRanks.rank3.id);
        targetMember.removeRole(allRanks.rank4.id);

        targetMember.addRole(role);
        message.channel.send(targetSearch + ' changed rank ' + thisGuild.roles.get(role).name).catch(console.error);
        if (rankCounter < membersArray.length) {
            rankCounter++;
            console.log(rankCounter);
            recursiveCount(rankCounter)
        }
    } else {
        message.channel.send(targetSearch + ' same rank '  + thisGuild.roles.get(role).name).catch(console.error);
        if (rankCounter < membersArray.length) {
            rankCounter++;
            console.log(rankCounter);
            recursiveCount(rankCounter)
        }
    }
}
// function recursiveCount(index) {
//     // console.log(membersArray[index]);
//     if (!membersArray[index]) return;
//
//     if (membersArray[index].nickname) {
//         targetSearch = membersArray[index].nickname
//         targetMember = membersArray[index];
//         getStats('forRank');
//     } else {
//         targetSearch = membersArray[index].user.username
//         targetMember = membersArray[index];
//         getStats('forRank');
//     }
//     // console.log(targetSearch);
// }
class adminCommands {
    constructor() {

    }

}
module.exports = adminCommands;
