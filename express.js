const express = require('express')
const app = express()
const port = 3030;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

var localtunnel = require('localtunnel');

var tunnel = localtunnel(port, function(err, tunnel) {
    if (err) console.error(err);

    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    tunnel.url;
    console.log(tunnel.url);
});

tunnel.on('close', function() {
    // tunnels are closed
});
