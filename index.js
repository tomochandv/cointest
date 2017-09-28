const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const io = require('socket.io')(http)
const rp = require('request-promise')

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
        io.emit('btc', hisData)
      })
    }
    else{
      const options = {
        uri : 'https://api.etherscan.io/api?module=account',
        qs : {
          apikey : 'PFC28P6RJ5THARD1T6FFVKEBKYEIS9FF1H',
          module : 'account',
          action : 'balance',
          tag : 'latest',
          address : addr
        },
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      }

      const optionsTran = {
        uri : 'https://api.etherscan.io/api?module=account',
        qs : {
          apikey : 'PFC28P6RJ5THARD1T6FFVKEBKYEIS9FF1H',
          module : 'account',
          action : 'txlist',
          startblock : 0,
          endblock : 99999999999,
          sort : 'desc',
          address : addr
        },
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      }
      var result = {
        balance : 0,
        tran : {}
      }
      rp(options)
      .then(function (repos) {
        result.balance = repos.result
        rp(optionsTran)
        .then(function (repos) {
          result.tran = repos.result
          io.emit('eth', result)
        })
        .catch(function (err) {
          console.log(err)
        })
      })
      .catch(function (err) {
        console.log(err)
      })
    }
  })
})

http.listen(8080, function(){
  console.log('listening on *:8080');
})
