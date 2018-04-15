var Crawler = require("node-webcrawler");
var url = require('url');

class FCrawler {
    constructor() {
        this.c = new Crawler({
            maxConnections : 10,
            // This will be called for each crawled page
            callback : function (error, result, $) {
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                if(error){
                    console.log(error);
                }else{
                    console.log($("title").text());
                }
            }
        });
    }

    test(){
        console.log('asd');
        this.c.queue([{
            uri: 'https://fortnitetracker.com/profile/pc/arelam',
            jQuery: true,

            // The global callback won't be called
            callback: function (error, result, $) {
                if(error){
                    console.log(error);
                } else {
                    console.log(result.body);
                    console.log($('.trn-stats').html())
                }
            }
        }]);
    }

}
module.exports = FCrawler;
