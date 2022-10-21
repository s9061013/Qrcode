const express = require('express');

const app = express();
const port = process.env.PORT || 8000;

//var http=require('http');

const url = require('url');
const QRCode = require('magic-qr-code');
const Canvas = require('canvas');
const fs = require('fs');
const querystring = require('querystring');
 
function draw(data, size = 1024) {
    let marginSize = 1;
    let dataLength = data.length;
    let dataLengthWithMargin = dataLength + 2 * marginSize;
    let canvas = Canvas.createCanvas(size, size);
    let ctx = canvas.getContext('2d');
    let pointSize = Math.floor(size / dataLengthWithMargin);
    if (pointSize === 0) {
        throw new Error('cannot draw this QR Code');
    }
    let margin = Math.floor((size - (pointSize * dataLength)) / 2);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'black';
    for (let i = 0; i < dataLength; ++i) {
        for (let j = 0; j < dataLength; ++j) {
            if (data[i][j]) {
                let x = j * pointSize + margin;
                let y = i * pointSize + margin;
                ctx.fillRect(x, y, pointSize, pointSize);
            }
        }
    }
    return canvas;
}

app.get('/qrcode', function(req, res) {
  //const a = req.query
	//console.log('a')
	//console.log(a)
  const vcid = req.query.vcid;
  var qrcodeUrl = `http://192.168.1.125:8080/jumbotron.html?vcid=${vcid}`;
  //var qrcodeUrl = `file:///home/michael/vscode_project/protoType-frontend/jumbotron.html?vcid=${vcid}`
  console.log(qrcodeUrl);

  //let result = QRCode.encode('http://test.baasid.com/?vcid='.toUpperCase());
  let result = QRCode.encode(qrcodeUrl);
  let canvas = draw(result);	
  const fs = require('fs');
  let pngBuffer = canvas.toBuffer();
  fs.writeFileSync('./out.png', pngBuffer);

  var img = fs.readFileSync('./out.png');
  res.writeHead(200, {'Content-Type': 'image/gif' });
  res.end(img, 'binary');
  //res.end();

  //res.send({
  //  'test': test
  //});
});

//server.listen(5000, "0.0.0.0");
app.listen(port, "0.0.0.0");
console.log('Server started at http://localhost:' + port);

