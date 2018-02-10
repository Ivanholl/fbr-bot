var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to mongo!');
});

var playerSchema = mongoose.Schema({
    name: { type: String, require: '{PATH} is required', unique: true },
    initialKills: { type: Number, require: '{PATH} is required' },    
    currentKills: Number
});
var Player = mongoose.model('Player', playerSchema);

function registerPlayer(player){
    var newPlayer = new Player(player);
    newPlayer.save(function (err, newPlayer) {
        if (err) {
            console.error(err);
            return false;
        } else {
            console.log("registered");
            return true;
        }
    });
}

function getPlayers(){
    return new Promise((resolve, reject) => {
        Player.find({},function(res){
            if (res) {
                console.log(res);
                resolve(res)
            } else {
                reject()
            }
        })
    })

}

module.exports = {
    registerPlayer : registerPlayer,
    getPlayers : getPlayers
}
