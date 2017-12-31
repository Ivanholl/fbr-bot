// const Discord = require("discord.js");
// const Fortnite = require('./node_modules/fortnite-api');
// const nightmare = require('./node_modules/nightmare');
const assert  = require('./node_modules/assert');
const {BrowserWindow} = require('./node_modules/electron')

const fbot = require('./fbot.js');

function buildNews(news){
    if (Array.isArray(news.br)) {
        var strngHtml = '<div class="col-xs-12">';
        for (var i = 0; i < news.br.length; i++) {
            strngHtml += '<div class="col-xs-4">```md\n#' + news.br[i].title + '\n' + news.br[i].body + '```"</div>"' +  news.br[i].image
        }
        strngHtml += "</div>";
    }
    getPic(strngHtml)
    // console.log(strngHtml);
    // message.channel.send(strngHtml);
    // return;
}
function getPic(html){
    let win = new BrowserWindow({width: 800, height: 600})
    ImageParser(source, options)

    message.channel.send();
}
module.exports = {
    buildNews : buildNews
}
