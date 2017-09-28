const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)

const bitcoin = require('bitcoinjs-lib')
const blockchain = require('blockchain.info')
const pushtx = require('blockchain.info/pushtx')
const blockexplorer = require('blockchain.info/blockexplorer')

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/view/index.html'));
})  

io.sockets.on('connection', function (socket) {  
  console.log('Socket initiated!')
  socket.on('address', (data) => { 
    const type = data.type
    const addr = data.addr
    if(type == 'btc'){
      blockexplorer.getAddress(addr, null).then(function(hisData){
        console.log(hisData)
        io.emit('address', hisData);
      })
    }
  })
})

http.listen(80, function(){
  console.log('listening on *:80');
})


function getEth(value){
    console.log(value)
    const mode = value / wei
    return mode.toFixed(3)
}