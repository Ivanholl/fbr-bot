const config = require('../config.json');

class RolesManager {
    constructor() {
        this.allRanks = config.allRanks
        this.rank1 = config.allRanks.rank0
        this.rank2 = config.allRanks.rank1
        this.rank3 = config.allRanks.rank2
        this.rank4 = config.allRanks.rank3
        this.rank5 = config.allRanks.rank4
        this.rank6 = config.allRanks.rank5
    }
    getRole(kd) {
        let res = {
            role: '',
            nextRole: {},
            kd: kd
        }
        switch (true) {
            case (kd < this.rank1.kd[0]):
                res.role = this.rank1.id
                res.nextRole  = this.rank2
                break;
            case (kd > this.rank2.kd[0] && kd < this.rank2.kd[1]):
                res.role = this.rank2.id
                res.nextRole  = this.rank3
                break;
            case (kd > this.rank3.kd[0] && kd < this.rank3.kd[1]):
                res.role = this.rank3.id
                res.nextRole  = this.rank4
                break;
            case (kd > this.rank4.kd[0] && kd < this.rank4.kd[1]):
                res.role = this.rank4.id
                res.nextRole  = this.rank5
                break;
            case (kd > this.rank5.kd[0] && kd < this.rank5.kd[1]):
                res.role = this.rank5.id
                res.nextRole  = this.rank6
                break;
            case (kd > this.rank6.kd[0]  && kd < this.rank6.kd[1]):
                res.role = this.rank6.id
                res.nextRole  = this.rank6
                break;
            default:
                res.role = this.rank1.id
                res.nextRole  = this.rank1
                break;
        }
        return res;
    }
}
module.exports = RolesManager;
