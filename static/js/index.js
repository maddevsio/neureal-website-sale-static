const socket = new WebSocket('wss://ropsten.infura.io/ws/g97D5zS7v5gxGRgzQV60');

var $textTokenEl = '#text_token';
var $textTokenTotalEth = '#text_total_eth';

let requestId = 1;
let fromBlock = 'earliest';
let toBlock = 'latest';
let topics = ['0x19287f35bf9ce71d59481bf0e504fc7f02e898d429c85d11f5276bc24bd903c3'];
let address = '0x9F56ec099d988b1016CcE7f14c002b0943d635E5';

socket.onopen = function() {
  socketSendMessage();
}

socket.onmessage = function(message){
  var data = JSON.parse(message.data);
  var result = data.result;

  if (!result)
    return

  var firstLog = result[result.length - 1];
  fromBlock = firstLog.blockNumber;
  values = parseHex2Dig(firstLog.data);

  var neurealTokens = values[0];
  var totalEth = values[1];

  if (neurealTokens > 0){
    neurealTokens = neurealTokens / 10 ** 18;
  }

  if (totalEth > 0){
    totalEth = totalEth / 10 ** 18;
  }

  $($textTokenEl).text(parseInt(neurealTokens));
  $($textTokenTotalEth).text(totalEth.toFixed(3));
}

var dataFetcher;

socket.onclose = function(){
  clearInterval(dataFetcher);
}

dataFetcher = setInterval(function() {
  socketSendMessage();
}, 10000);

function socketSendMessage(){
  socket.send(JSON.stringify({
    "jsonrpc": "2.0",
    "id": requestId,
    "method": "eth_getLogs",
    "params": [{fromBlock, toBlock, topics, address}]
  }));
  requestId ++;
}

function parseHex2Dig(data) {
  let values = data.replace('0x', '');
  if (!values)
    return [];

  values = values.match(/.{1,64}/g);
  values.forEach((value, index) => {
    values[index] = parseInt(value, 16);
  });
  return values;
}
