const webshot = require('webshot');

const fbot = require('./fbot.js');
const chestLocations = require('./templates/chests.json');
class ImageBuilder {
    constructor(siteType, windowSize, cookies) {
        this.options = {
            siteType: siteType || 'html',
            // siteType: siteType || 'file',
            windowSize: windowSize || {width: 1024, height: 768},
            cookies: cookies || [],
            customCSS: `
                *{box-sizing: border-box;}
                .container{position:relative;overflow: hidden;}
                .relative{position:relative;}
                .absolute{position:absolute;}
                .whiteText {color: white;}
                .whiteBg {background: rgba(255,255,255,0.3);}

                .fl-right{float:right;}
                .max-size{width:100%;height:100%;}
                .max-width{width:100%;}
                .super-size{width: 200%;}
                .half-size{width:50%;height:50%;}

                .news{text-align: center;position: absolute;top: -10px;}
                .map{width:850px;height:850px;z-index: 2;position: absolute;border-right: 10px solid white;}
                .marker{width:30px;height:30px;margin-top:-15px;margin-left:-15px;z-index: 3;}
                .scheenshot{width: 1512px;height: 850px;}

                .col-50{width: 50%;display: inline-block;}
                .col-50 h1{font-size: 40px;text-transform: uppercase;}
                .col-50 p{font-weight: 700;font-size:22px;}
                .col-29{width:30%; padding:0 20px; display: inline-block; border-right:1px solid white;}
                .col-29:last-child { bor-right: none; }
                .col-29 h3{font-weight:800;font-size: 30px;}
                .col-29 p{font-size:22px;}
            `
        }
    }
    buildNews(news){
        return new Promise((resolve) => {
            var html ='<div class="container">' +
                        '<img class="super-size" src="https://static-assets-prod.epicgames.com/fortnite/static/webpack/57d5bc6799f2bb082b721935dc55ed96.jpg">' +
                        '<div class="news">' +
                        '<div class="max-width">'+
                            '<div class="col-50">'+
                                '<h1 class="whiteText">' + news.common.title + '</h1>' +
                                '<p class="whiteText">' + news.common.body.replace(/\n/, "<br />") + '</p>'+
                            '</div>'+
                        '</div>';

            for (var i = 0; i < news.br.length; i++) {
                // html += '<div class="col-29">'  +
                //             '<img class="whiteBg max-width" src="' +  + '">' +
                //             '<h3>' +  + '</h3>' +
                //             '<p>' + news.br[i].body + '</p>' +
                //         '</div>';
                html += `
                <div class="col-29">
                    <img class="whiteBg max-width" src=" ${news.br[i].image}">
                    <h3>${news.br[i].title}</h3>
                    <p>${news.br[i].body}</p>
                </div>
                `
            }

            html +='</div></div>';
            webshot(html, 'templates/news.png', baseOptions, (err) => {
                if(err) return console.log(err);
                resolve("templates/news.png")
            })
        })
    }
    buildMap(){
        return new Promise((resolve, reject) => {
            var location = chestLocations.lootchests[Math.floor(Math.random() * chestLocations.lootchests.length)]
            // var location =  { lng: 1812, lat: 1622}
            let lng = (location.lng / 2048 * 850).toFixed(0);
            let lat = (location.lat / 2048 * 850).toFixed(0);
            var html = `<div class="container max-size">
                            <img class="map" src="http://www.fortnitechests.info/assets/images/web/newmap.jpg">
                            <img style="right: -117px" class="scheenshot absolute" src="http://www.fortnitechests.info/assets/images/chests/${lng}_${lat}.png">
                            <img style="top: ${850 - lat * 1}px;left: ${lng}px;" class="marker absolute" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Red_x.svg/1024px-Red_x.svg.png">
                        </div>`;
            // var html = 'fbot.html'
            var buffers = [];
            var renderStream = webshot(html, this.options);

            renderStream.on('data', (data) => {

                buffers.push(data)
            });
            renderStream.on('end', () => {
                // console.log(data);
                var temp = Buffer.concat(buffers)
                resolve(temp);
            });
            renderStream.on('error', (err) => {
                console.error(err);
                reject(err);
            });

        }).catch((err) => {
            console.error(err);
            reject(err)
        })
    }
    renderImages(){
        var location = chestLocations.lootchests[Math.floor(Math.random() * chestLocations.lootchests.length)]
        // var location =  { lng: 1812, lat: 1622}
        let lng = (location.lng / 2048 * 850).toFixed(0);
        let lat = (location.lat / 2048 * 850).toFixed(0);
        var html = `<div class="container max-size">
                        <img class="map" src="http://www.fortnitechests.info/assets/images/web/map.jpg">
                        <img style="right: -117px" class="scheenshot absolute" src="http://www.fortnitechests.info/assets/images/chests/${lng}_${lat}.png">
                        <img style="top: ${850 - lat * 1}px;left: ${lng}px;" class="marker absolute" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Red_x.svg/1024px-Red_x.svg.png">
                    </div>`;

        webshot(html, 'google.png', this.options, function(err) {
            // screenshot now saved to google.png
        });
    }
}
module.exports = ImageBuilder;
